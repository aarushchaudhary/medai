require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Connect to MongoDB Database ---
// This function is called as soon as the server starts.
connectDB();

// --- App Configuration ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Import API Routes ---
const chatRoutes = require('./routes/chatRoutes');

// --- Middleware ---
// Enable Cross-Origin Resource Sharing to allow your React app to communicate with this server.
app.use(cors());
// Enable the server to accept and parse JSON in request bodies.
app.use(express.json());

// --- API Route Setup ---
// Any request starting with /api will be handled by the chatRoutes module.
app.use('/api', chatRoutes);

// --- Default Route for Testing ---
app.get('/', (req, res) => {
  res.send('MedAI Server is running.');
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

