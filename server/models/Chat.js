const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot', 'ai']
  },
  text: {
    type: String, // Storing encrypted text
    required: true
  }
}, { _id: false }); // No separate _id for messages

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  messages: [MessageSchema],
  // --- NEW FIELD ---
  pinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// --- NEW: Index for efficient sorting ---
ChatSchema.index({ pinned: -1, createdAt: -1 });

module.exports = mongoose.model('Chat', ChatSchema);