const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Existing route for real-time chat
router.post('/chat', chatController.handleChatRequest);

// --- ROUTES FOR CHAT HISTORY ---
router.get('/history', chatController.getChatHistory);
router.get('/history/:id', chatController.getChatById);
router.post('/save', chatController.saveChat);

// --- NEW & CORRECTED ROUTES ---
// PATCH route to update a chat (for renaming and pinning)
router.patch('/history/:id', chatController.updateChat);

// DELETE route to delete a chat
router.delete('/history/:id', chatController.deleteChat);


module.exports = router;