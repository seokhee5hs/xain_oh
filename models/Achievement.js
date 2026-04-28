const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Government', 'Industry', 'Award'], required: true },
  description: String,
  details: [String],
  year: Number,
  status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
  amount: String,
  institution: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AchievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Achievement', AchievementSchema);
