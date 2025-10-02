const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Existing route for real-time chat
router.post('/chat', chatController.handleChatRequest);

// --- NEW ROUTES FOR CHAT HISTORY ---

// GET route to fetch all chat session titles
router.get('/history', chatController.getChatHistory);

// POST route to save a completed chat session
router.post('/save', chatController.saveChat);


module.exports = router;
