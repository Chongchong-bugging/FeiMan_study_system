const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const requireDatabase = require('../middleware/database');
const KnowledgePoint = require('../models/KnowledgePoint');

const router = express.Router();
const allowedStatuses = ['not_started', 'in_progress', 'mastered'];
router.use(auth, requireDatabase);

function validateFields(body, creating) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return '请求体必须是 JSON 对象';
  if (creating || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) {
      return '标题长度应为 1～200 个字符';
    }
  }
  if (creating || Object.hasOwn(body, 'content')) {
    if (typeof body.content !== 'string' || !body.content.trim() || body.content.length > 50000) {
      return '内容长度应为 1～50000 个字符';
    }
  }
  if (Object.hasOwn(body, 'status') && !allowedStatuses.includes(body.status)) return '学习状态无效';
  if (Object.hasOwn(body, 'reviewList') && typeof body.reviewList !== 'boolean') return '复习列表标记必须是布尔值';
  return null;
}

function validId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: '知识点 ID 无效' });
  next();
}

router.post('/', async (req, res) => {
  const error = validateFields(req.body, true);
  if (error) return res.status(400).json({ msg: error });
  const { title, content, status, reviewList } = req.body;
  const kp = await KnowledgePoint.create({
    user: req.user.id, title: title.trim(), content,
    ...(status !== undefined && { status }),
    ...(reviewList !== undefined && { reviewList })
  });
  res.status(201).json(kp);
});

router.get('/', async (req, res) => {
  const points = await KnowledgePoint.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(points);
});

router.get('/:id', validId, async (req, res) => {
  const kp = await KnowledgePoint.findById(req.params.id);
  if (!kp) return res.status(404).json({ msg: 'Knowledge point not found' });
  if (kp.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
  res.json(kp);
});

router.put('/:id', validId, async (req, res) => {
  const error = validateFields(req.body, false);
  if (error) return res.status(400).json({ msg: error });
  const kp = await KnowledgePoint.findById(req.params.id);
  if (!kp) return res.status(404).json({ msg: 'Knowledge point not found' });
  if (kp.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
  for (const field of ['title', 'content', 'status', 'reviewList']) {
    if (Object.hasOwn(req.body, field)) kp[field] = field === 'title' ? req.body[field].trim() : req.body[field];
  }
  await kp.save();
  res.json(kp);
});

router.delete('/:id', validId, async (req, res) => {
  const kp = await KnowledgePoint.findById(req.params.id);
  if (!kp) return res.status(404).json({ msg: 'Knowledge point not found' });
  if (kp.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
  await kp.deleteOne();
  res.json({ msg: 'Knowledge point removed' });
});

module.exports = router;
