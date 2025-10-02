const scraper = require('../services/scraperService');
const ai = require('../services/aiService');
const Chat = require('../models/Chat');
const { encrypt, decrypt } = require('../services/encryptionService');

/**
 * Handles incoming chat messages in real-time, scrapes for context,
 * and gets a response from the AI model.
 */
const handleChatRequest = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    
    const cdscoData = await scraper.scrapeWebsite('https://cdsco.gov.in/opencms/opencms/en/Home/', message);
    const pubmedData = await scraper.scrapeWebsite(`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(message)}`, message);
    
    let indexingStatus = "Sites successfully indexed.";
    if (cdscoData.startsWith('Could not retrieve') && pubmedData.startsWith('Could not retrieve')) {
        indexingStatus = "Site indexing failed.";
    }

    const prompt = `
      You are "Pharma Guide India," an expert AI. Your responses must be extremely concise and perfectly formatted.

      User query: "${message}"
      
      Scraped Context:
      ---
      ${cdscoData}
      ${pubmedData}
      ---

      YOUR TASK & FORMATTING RULES:
      1.  FIRST LINE ONLY: Your entire response MUST begin with the indexing status and nothing else. The status is: "${indexingStatus}"
      2.  TOP SEPARATOR: Immediately after the status line, you MUST insert a markdown horizontal rule (\`---\`).
      3.  MAIN ANSWER: After the separator, provide the main answer.
          - If the query is about drug/food interactions, use "### Safety", "### Side Effects", and "### Prevention" headings. Use only short bullet points under each.
          - If it's a general question, provide a brief, direct answer without special headings.
          - If context is empty, state the answer is based on general knowledge.
      4.  BOTTOM SEPARATOR: Before the disclaimer, you MUST insert another markdown horizontal rule (\`---\`).
      5.  DISCLAIMER: End with the mandatory disclaimer.

      Disclaimer Text:
      ### Disclaimer
      AI assistant. Consult a professional for medical or legal advice.
    `;

    const reply = await ai.getAiResponse(prompt);
    res.json({ reply });

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};


/**
 * Saves a completed chat session to the database.
 * Messages are encrypted before storage.
 */
const saveChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length < 2) {
      return res.status(400).json({ error: 'A valid chat session is required.' });
    }
    
    // Find the first user message to create a more relevant title.
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    const title = firstUserMessage ? firstUserMessage.text.substring(0, 30) + '...' : 'Chat Session...';


    const encryptedMessages = messages.map(msg => ({
      sender: msg.sender,
      text: encrypt(msg.text) // Encrypt the message text
    }));
    
    const newChat = new Chat({
      title,
      messages: encryptedMessages
    });

    await newChat.save();
    res.status(201).json({ message: 'Chat saved successfully.', chatId: newChat._id });

  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ error: 'Failed to save chat.' });
  }
};

/**
 * Fetches the list of all saved chat titles and their IDs.
 * Now sorts pinned chats to the top.
 */
const getChatHistory = async (req, res) => {
  try {
    // MODIFIED: Sort by pinned status first, then by creation date
    const chats = await Chat.find()
      .sort({ pinned: -1, createdAt: -1 })
      .select('title _id pinned'); // Also select the 'pinned' field
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
};

/**
 * Fetches a single chat by its ID and decrypts its messages.
 */
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    // Decrypt the messages before sending them to the client
    const decryptedMessages = chat.messages.map(msg => ({
      ...msg.toObject(), // Convert mongoose doc to plain object
      text: decrypt(msg.text)
    }));

    res.json({ ...chat.toObject(), messages: decryptedMessages });

  } catch (error) {
    console.error('Error fetching chat by ID:', error);
    res.status(500).json({ error: 'Failed to fetch chat.' });
  }
};

/**
 * --- NEW FUNCTION ---
 * Updates a chat's title or pinned status.
 */
const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pinned } = req.body;

    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    if (typeof title === 'string') {
      chat.title = title;
    }

    if (typeof pinned === 'boolean') {
      chat.pinned = pinned;
    }

    await chat.save();
    res.json(chat);

  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({ error: 'Failed to update chat.' });
  }
};

/**
 * --- NEW FUNCTION ---
 * Deletes a chat from the database.
 */
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Chat.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    res.status(200).json({ message: 'Chat deleted successfully.' });

  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat.' });
  }
};


// --- CORRECTED EXPORTS ---
// Ensure all functions are exported so the router can use them.
module.exports = { 
  handleChatRequest,
  saveChat,
  getChatHistory,
  getChatById,
  updateChat,
  deleteChat
};

