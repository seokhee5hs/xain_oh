const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['PI', 'Graduate', 'Undergraduate', 'Collaborator'], required: true },
  title: String,
  email: String,
  phone: String,
  bio: String,
  avatar: String,
  researchAreas: [String],
  status: { type: String, enum: ['Active', 'Alumni', 'Visiting'], default: 'Active' },
  joinDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MemberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Member', MemberSchema);
