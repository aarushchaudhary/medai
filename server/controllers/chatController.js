const scraper = require('../services/scraperService');
const ai = require('../services/aiService');
const Chat = require('../models/Chat');
const { encrypt, decrypt } = require('../services/encryptionService');

/**
 * Handles incoming text-based chat messages, scrapes for context,
 * and gets a response from the AI model.
 */
const sendMessage = async (req, res) => {
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

    // Assumes aiService.getAiResponse can handle a text-only prompt
    const reply = await ai.getAiResponse(prompt);
    res.json({ reply });

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

/**
 * --- NEW FUNCTION ---
 * Handles image uploads, creates a prompt for analysis,
 * and gets a response from the AI model.
 */
const uploadImageAndAnalyze = async (req, res) => {
    try {
      const { message } = req.body; 
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ error: 'Image file is required.' });
      }
      
      const prompt = `
        You are "Pharma Guide India," an expert AI specializing in analyzing images of medicine labels, food labels, and doctor's prescriptions. Your responses must be concise and well-formatted.

        User query: "${message}"
        
        Attached Image: 

        YOUR TASK & FORMATTING RULES:
        1.  Analyze the attached image.
        2.  Provide a clear and concise summary of the key information found in the image.
        3.  If the user asks a specific question in their query, focus your answer on that question.
        4.  Use markdown for clarity (e.g., headings, bullet points).
        5.  Insert a markdown horizontal rule (\`---\`) before the disclaimer.
        6.  End with the mandatory disclaimer.

        Disclaimer Text:
        ### Disclaimer
        AI assistant. Consult a professional for medical or legal advice. This analysis is based on the provided image and may not be fully accurate.
      `;
      
      // Assumes your aiService.getAiResponse is updated to handle a file argument
      const reply = await ai.getAiResponse(prompt, file); 

      res.json({ reply, imageUrl: `/uploads/${file.filename}` });

    } catch (error) {
      console.error('Error in image analysis controller:', error);
      res.status(500).json({ message: error.message || 'An internal server error occurred during image analysis.' });
    }
};


/**
 * Saves a completed chat session to the database.
 * Messages (including image URLs) are encrypted before storage.
 */
const saveChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length < 2) {
      return res.status(400).json({ error: 'A valid chat session is required.' });
    }
    
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    const title = firstUserMessage ? firstUserMessage.text.substring(0, 30) + '...' : 'Chat Session...';

    const encryptedMessages = messages.map(msg => ({
      sender: msg.sender,
      text: encrypt(msg.text),
      image: msg.image // Save the image URL along with the message
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
 * Sorts pinned chats to the top.
 */
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ pinned: -1, createdAt: -1 })
      .select('title _id pinned');
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

    const decryptedMessages = chat.messages.map(msg => ({
      ...msg.toObject(),
      text: decrypt(msg.text),
      image: msg.image // Also retrieve the image URL
    }));

    res.json({ ...chat.toObject(), messages: decryptedMessages });

  } catch (error) {
    console.error('Error fetching chat by ID:', error);
    res.status(500).json({ error: 'Failed to fetch chat.' });
  }
};

/**
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


module.exports = { 
  sendMessage,
  uploadImageAndAnalyze,
  saveChat,
  getChatHistory,
  getChatById,
  updateChat,
  deleteChat
};