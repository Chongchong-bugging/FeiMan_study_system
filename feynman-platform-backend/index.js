const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
const User = require('./models/User');

// 本机 DNS(45.14.70.56) 不支持 SRV 记录查询，会导致 mongodb+srv 报 querySrv ENODATA。
// 这里强制 MongoDB 驱动的 SRV 解析走公共 DNS，绕过本地 DNS 缺陷。
dns.setServers(['119.29.29.29', '223.5.5.5']);

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// 第二次课的地址继续可用，方便原有客户端过渡。
const users = require('./routes/users');
app.use('/api/users', users);
app.use('/api', users);
app.use('/api/knowledge-points', require('./routes/knowledgePoints'));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.status(404).json({ msg: '接口或页面不存在' }));

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    const msg = err.keyPattern?.email ? 'Email already exists' : 'Username already exists';
    return res.status(400).json({ msg });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ msg: '请求体不是有效的 JSON' });
  if (err.type === 'entity.too.large') return res.status(413).json({ msg: '请求体过大' });
  if (err.name === 'ValidationError') return res.status(400).json({ msg: '提交的数据无效' });
  console.error('请求处理失败：', err.message);
  res.status(500).json({ msg: 'Server Error' });
});

async function start() {
  require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
  if (!process.env.MONGO_URI) throw new Error('请先在 .env 中设置 MONGO_URI');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('请先在 .env 中设置至少 32 字符的 JWT_SECRET');
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  await User.init();
  console.log('MongoDB connected successfully!');

  const port = Number(process.env.PORT || 3000);
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`费曼学习平台：http://localhost:${port}`);
      console.log('停止服务：Ctrl+C');
      resolve();
    });
    server.on('error', reject);
  });
}

if (require.main === module) {
  start().catch(async err => {
    console.error(err.code === 'EADDRINUSE'
      ? '端口已被占用，请停止旧服务器后重试。'
      : `启动失败：${err.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}

module.exports = app;
