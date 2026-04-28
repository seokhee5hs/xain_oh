const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'In Progress' },
  startDate: Date,
  endDate: Date,
  team: [String],
  technologies: [String],
  results: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
