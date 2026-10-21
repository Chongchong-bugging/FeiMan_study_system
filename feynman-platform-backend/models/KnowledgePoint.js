const mongoose = require('mongoose');

const KnowledgePointSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 50000 },
  status: { type: String, enum: ['not_started', 'in_progress', 'mastered'], default: 'not_started' },
  reviewList: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgePoint', KnowledgePointSchema);
