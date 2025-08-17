const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    originalTranscript: { type: String, required: true },
    prompt: { type: String, default: 'Generate a concise summary of this transcript' },
    tags: [{ type: String, trim: true }],

    // single source of truth for sharing:
    isShared: { type: Boolean, default: false },
    sharedWith: [
      {
        email: { type: String, lowercase: true, trim: true },
        sharedAt: { type: Date, default: Date.now }
      }
    ],
    shareToken: { type: String, unique: true, sparse: true },

    createdBy: { type: String, default: 'anonymous' }
  },
  { timestamps: true }
);

// helpful index when checking duplicates
summarySchema.index({ 'sharedWith.email': 1 });

module.exports = mongoose.model('Summary', summarySchema);
