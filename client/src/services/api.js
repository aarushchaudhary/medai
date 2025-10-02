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
 * Fetches the list of all saved chats from the server.
 */
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch chat history.');
    return await response.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return []; // Return an empty array on error
  }
};

/**
 * Fetches a single, complete chat session by its ID.
 */
export const getChatById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}`);
    if (!response.ok) throw new Error('Failed to fetch chat by ID.');
    return await response.json();
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    return null; // Return null on error
  }
};

/**
 * --- NEW FUNCTION ---
 * Updates a chat's data (e.g., title or pinned status).
 */
export const updateChat = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update chat.');
    return await response.json();
  } catch (error) {
    console.error("Error updating chat:", error);
    return null;
  }
};

/**
 * --- NEW FUNCTION ---
 * Deletes a chat by its ID.
 */
export const deleteChat = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete chat.');
    return await response.json();
  } catch (error) {
    console.error("Error deleting chat:", error);
    return null;
  }
};

/**
 * (Placeholder) A function for handling file uploads.
 */
export const uploadImageToServer = async (file) => {
    console.log("Uploading file:", file.name);
    // This is a simulated response.
    return new Promise(resolve => setTimeout(() => resolve(`Analyzed ${file.name}. [Analysis feature coming soon]`), 1500));
}
