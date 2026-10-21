const mongoose = require('mongoose');

module.exports = function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ msg: '数据库尚未连接，请稍后重试' });
  }
  next();
};
