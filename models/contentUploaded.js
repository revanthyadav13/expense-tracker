const mongoose = require('mongoose');

const contentUploadedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields to your documents.
});

const ContentUploaded = mongoose.model('ContentUploaded', contentUploadedSchema);

module.exports = ContentUploaded;
