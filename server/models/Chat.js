const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot'] // Can only be 'user' or 'bot'
  },
  text: {
    type: String, // This will store the encrypted message
    required: true
  }
}, { _id: false }); // Don't create a separate _id for each message

const ChatSchema = new mongoose.Schema({
  // We can add a user ID here later for multi-user support
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: true
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', ChatSchema);

