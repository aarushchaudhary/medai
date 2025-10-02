const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends a single message to the chat endpoint and gets a reply.
 */
export const sendMessageToServer = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Failed to fetch chat response:", error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
};

/**
 * Sends a full chat session to the server to be saved.
 */
export const saveChatToServer = async (messages) => {
  if (messages.length <= 1) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) throw new Error('Failed to save chat.');

    const data = await response.json();
    console.log('Chat saved successfully:', data.chatId);
    return data;

  } catch (error) {
    console.error("Error saving chat:", error);
    return null;
  }
};

/**
 * (Placeholder) A function for handling file uploads.
 * This will require a new backend endpoint to be fully functional.
 */
export const uploadImageToServer = async (file) => {
    console.log("Uploading file:", file.name);
    // This is a simulated response.
    return new Promise(resolve => setTimeout(() => resolve(`Analyzed ${file.name}. [Analysis feature coming soon]`), 1500));
}

