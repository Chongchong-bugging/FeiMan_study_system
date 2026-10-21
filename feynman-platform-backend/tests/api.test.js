const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long';
const User = require('../models/User');
const KnowledgePoint = require('../models/KnowledgePoint');
const app = require('../index');

test('第五次课 API：跨域、注册、JWT 认证与知识点 CRUD', async t => {
  const users = [];
  const points = [];
  let databaseState = 1;
  const originals = {
    userFindOne: User.findOne,
    userCreate: User.create,
    pointCreate: KnowledgePoint.create,
    pointFind: KnowledgePoint.find,
    pointFindById: KnowledgePoint.findById,
    readyState: Object.getOwnPropertyDescriptor(mongoose.connection, 'readyState')
  };
  Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, get: () => databaseState });
  User.findOne = query => {
    const row = users.find(item => Object.entries(query).every(([key, value]) => item[key] === value));
    return {
      then: (resolve, reject) => Promise.resolve(row || null).then(resolve, reject),
      select: fields => {
        assert.equal(fields, '+password');
        return Promise.resolve(row || null);
      }
    };
  };
  User.create = async input => {
    const user = new User(input);
    await user.validate();
    users.push(user);
    return user;
  };
  KnowledgePoint.create = async input => {
    const point = new KnowledgePoint(input);
    await point.validate();
    point.createdAt = new Date();
    point.save = async () => {
      await point.validate();
      return point;
    };
    point.deleteOne = async () => {
      const index = points.indexOf(point);
      if (index >= 0) points.splice(index, 1);
    };
    points.push(point);
    return point;
  };
  KnowledgePoint.find = query => ({
    sort: async () => points.filter(point => point.user.toString() === query.user).reverse()
  });
  KnowledgePoint.findById = async id => points.find(point => point.id === id) || null;

  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (method, route, body, token, authHeader = 'Authorization') => fetch(`${base}${route}`, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { [authHeader]: authHeader === 'Authorization' ? `Bearer ${token}` : token })
    },
    ...(body !== undefined && { body: JSON.stringify(body) })
  });
  const account = { username: ' student ', email: ' STUDENT@Test.com ', password: 'password123' };
  let token;
  let pointId;

  try {
    await t.test('允许前端来源的跨域预检请求', async () => {
      const response = await fetch(`${base}/api/users/login`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type'
        }
      });
      assert.equal(response.status, 204);
      assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
      assert.match(response.headers.get('access-control-allow-methods'), /POST/);
    });

    await t.test('注册自动登录、bcrypt 哈希和 5 小时 JWT', async () => {
      const response = await request('POST', '/api/users/register', account);
      assert.equal(response.status, 201);
      const data = await response.json();
      token = data.token;
      assert.equal(data.user.username, 'student');
      assert.equal(data.user.email, 'student@test.com');
      assert.equal(users[0].email, 'student@test.com');
      assert.notEqual(users[0].password, account.password);
      assert.equal(await bcrypt.compare(account.password, users[0].password), true);
      assert.equal('password' in data.user, false);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      assert.equal(decoded.user.id, users[0].id);
      assert.equal(decoded.exp - decoded.iat, 5 * 60 * 60);
    });

    await t.test('登录验证密码，旧地址仍可用', async () => {
      const response = await request('POST', '/api/users/login', { email: account.email, password: account.password });
      assert.equal(response.status, 200);
      assert.ok((await response.json()).token);
      assert.equal((await request('POST', '/api/login', { email: account.email, password: 'wrong' })).status, 401);
      assert.equal((await request('POST', '/api/register', account)).status, 400);
      assert.equal(users.length, 1);
    });

    await t.test('缺失、伪造、过期令牌均被拒绝', async () => {
      assert.equal((await request('GET', '/api/knowledge-points')).status, 401);
      assert.equal((await request('GET', '/api/knowledge-points', undefined, 'invalid')).status, 401);
      const expired = jwt.sign({ user: { id: users[0].id } }, process.env.JWT_SECRET, { expiresIn: -1 });
      assert.equal((await request('GET', '/api/knowledge-points', undefined, expired)).status, 401);
    });

    await t.test('创建、列表、详情、更新和删除', async () => {
      const created = await request('POST', '/api/knowledge-points', { title: ' JWT ', content: '# JWT' }, token);
      assert.equal(created.status, 201);
      const item = await created.json();
      pointId = item._id;
      assert.equal(item.title, 'JWT');
      assert.equal(item.status, 'not_started');
      assert.equal(item.reviewList, false);
      assert.equal(item.user, users[0].id);

      const list = await request('GET', '/api/knowledge-points', undefined, token, 'x-auth-token');
      assert.equal(list.status, 200);
      assert.equal((await list.json()).length, 1);
      const detail = await request('GET', `/api/knowledge-points/${pointId}`, undefined, token);
      assert.equal(detail.status, 200);
      assert.equal((await detail.json()).content, '# JWT');

      const updated = await request('PUT', `/api/knowledge-points/${pointId}`,
        { status: 'mastered', reviewList: true, title: 'JWT 认证' }, token);
      assert.equal(updated.status, 200);
      assert.equal((await updated.json()).status, 'mastered');
      assert.equal(points[0].title, 'JWT 认证');

      const deleted = await request('DELETE', `/api/knowledge-points/${pointId}`, undefined, token);
      assert.equal(deleted.status, 200);
      assert.equal(points.length, 0);
      assert.equal((await request('GET', `/api/knowledge-points/${pointId}`, undefined, token)).status, 404);
    });

    await t.test('其他用户不能查看、修改或删除知识点', async () => {
      const owner = users[0].id;
      const foreign = jwt.sign({ user: { id: new mongoose.Types.ObjectId().toString() } }, process.env.JWT_SECRET);
      const point = await KnowledgePoint.create({ user: owner, title: '私有', content: '内容' });
      pointId = point.id;
      for (const method of ['GET', 'PUT', 'DELETE']) {
        const body = method === 'PUT' ? { title: '越权' } : undefined;
        assert.equal((await request(method, `/api/knowledge-points/${pointId}`, body, foreign)).status, 403);
      }
      const list = await request('GET', '/api/knowledge-points', undefined, foreign);
      assert.deepEqual(await list.json(), []);
      assert.equal(points.length, 1);
    });

    await t.test('无效输入、ID 和数据库不可用返回合适状态', async () => {
      for (const body of [{}, { title: ' ', content: '内容' }, { title: 'A', content: 'B', status: 'invalid' }]) {
        assert.equal((await request('POST', '/api/knowledge-points', body, token)).status, 400);
      }
      assert.equal((await request('PUT', `/api/knowledge-points/${pointId}`, { reviewList: 'yes' }, token)).status, 400);
      assert.equal((await request('GET', '/api/knowledge-points/not-an-id', undefined, token)).status, 400);
      databaseState = 0;
      assert.equal((await request('GET', '/api/knowledge-points', undefined, token)).status, 503);
      assert.equal((await request('POST', '/api/users/login', { email: account.email, password: account.password })).status, 503);
      databaseState = 1;
    });
  } finally {
    User.findOne = originals.userFindOne;
    User.create = originals.userCreate;
    KnowledgePoint.create = originals.pointCreate;
    KnowledgePoint.find = originals.pointFind;
    KnowledgePoint.findById = originals.pointFindById;
    if (originals.readyState) Object.defineProperty(mongoose.connection, 'readyState', originals.readyState);
    else delete mongoose.connection.readyState;
    await new Promise(resolve => server.close(resolve));
  }
});
