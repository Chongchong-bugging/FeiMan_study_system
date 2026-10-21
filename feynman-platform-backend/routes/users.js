const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireDatabase = require('../middleware/database');

const router = express.Router();
const validEmail = email => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const issueToken = user => jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '5h' });

router.post('/register', requireDatabase, async (req, res) => {
  const { username, email, password } = req.body || {};
  if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ msg: '用户名、邮箱和密码必须填写，并且必须是字符串' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length > 50) {
    return res.status(400).json({ msg: '用户名长度应为 1～50 个字符' });
  }
  if (!validEmail(cleanEmail)) return res.status(400).json({ msg: '请输入有效的邮箱地址' });
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ msg: '密码至少 8 个字符，且 UTF-8 长度不能超过 72 字节' });
  }

  if (await User.findOne({ email: cleanEmail })) return res.status(400).json({ msg: 'Email already exists' });
  if (await User.findOne({ username: cleanUsername })) return res.status(400).json({ msg: 'Username already exists' });

  const user = await User.create({
    username: cleanUsername,
    email: cleanEmail,
    password: await bcrypt.hash(password, 10)
  });
  res.status(201).json({
    msg: 'User registered successfully',
    token: issueToken(user),
    user: { id: user.id, username: user.username, email: user.email }
  });
});

router.post('/login', requireDatabase, async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !password) {
    return res.status(400).json({ msg: '请填写邮箱和密码' });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!validEmail(cleanEmail)) return res.status(400).json({ msg: '请输入有效的邮箱地址' });
  if (Buffer.byteLength(password, 'utf8') > 72) return res.status(400).json({ msg: '密码过长，请缩短后重试' });

  const user = await User.findOne({ email: cleanEmail }).select('+password');
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ msg: '邮箱或密码错误' });
  }
  res.json({
    msg: 'User logged in successfully',
    token: issueToken(user),
    user: { id: user.id, username: user.username, email: user.email }
  });
});

module.exports = router;
