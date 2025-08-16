const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  originalTranscript: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    default: 'Generate a concise summary of this transcript'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isShared: {
    type: Boolean,
    default: false
  },
  sharedEmails: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  sharedWith: [{
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
summarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
