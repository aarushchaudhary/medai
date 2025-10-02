const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot', 'ai']
  },
  text: {
    type: String, 
    required: true
  },
  // --- ADD THIS LINE ---
  image: {
    type: String,
    required: false // Not every message will have an image
  }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  messages: [MessageSchema],
  pinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

ChatSchema.index({ pinned: -1, createdAt: -1 });

module.exports = mongoose.model('Chat', ChatSchema);