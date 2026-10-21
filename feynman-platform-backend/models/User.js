const mongoose = require('mongoose');

// Schema 规定每条用户记录的字段；unique 会建立唯一索引。
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  // 保存密码哈希，默认查询不返回此字段。
  password: { type: String, required: true, select: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
