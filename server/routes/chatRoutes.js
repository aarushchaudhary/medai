const express = require('express');
const router = express.Router();
const {
  sendMessage,
  saveChat,
  getChatHistory,
  getChatById,
  updateChat,
  deleteChat,
  uploadImageAndAnalyze
} = require('../controllers/chatController');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/send', sendMessage);
router.post('/save', saveChat);
router.get('/history', getChatHistory);
router.get('/:id', getChatById);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);
router.post('/upload', upload.single('image'), uploadImageAndAnalyze);


module.exports = router;