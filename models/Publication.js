const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  type: { type: String, enum: ['Journal', 'Conference', 'Workshop'], required: true },
  journal: { type: String, required: true },
  year: { type: Number, required: true },
  doi: String,
  url: String,
  abstract: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PublicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Publication', PublicationSchema);
