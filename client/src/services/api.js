const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends a single text message to the chat endpoint and gets a reply.
 */
export const sendMessageToServer = async (message) => {
  try {
    // Corrected endpoint
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data; // Return the full response object
  } catch (error) {
    console.error("Failed to fetch chat response:", error);
    return { reply: "Sorry, I'm having trouble connecting. Please try again later." };
  }
};

/**
 * --- NEW IMPLEMENTATION ---
 * Uploads an image along with a text message for analysis.
 */
export const uploadImageAndMessageToServer = async (formData) => {
    try {
      // Corrected endpoint for image uploads
      const response = await fetch(`${API_BASE_URL}/chat/upload`, {
        method: 'POST',
        body: formData, // FormData handles the headers automatically
      });
  
      if (!response.ok) throw new Error('Network response was not ok during file upload');
      
      const data = await response.json();
      return data; // Returns { reply, imageUrl }
    } catch (error) {
      console.error("Failed to upload image and send message:", error);
      return { reply: "Sorry, I couldn't process the image. Please try again." };
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
    // Corrected endpoint
    const response = await fetch(`${API_BASE_URL}/chat/save`, {
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
    // Corrected endpoint
    const response = await fetch(`${API_BASE_URL}/chat/history`);
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
    // Corrected endpoint
    const response = await fetch(`${API_BASE_URL}/chat/${id}`);
    if (!response.ok) throw new Error('Failed to fetch chat by ID.');
    return await response.json();
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    return null; // Return null on error
  }
};

/**
 * Updates a chat's data (e.g., title or pinned status).
 */
export const updateChat = async (id, data) => {
  try {
    // Corrected endpoint and method
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'PUT', // Using PUT as per the controller for updates
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
 * Deletes a chat by its ID.
 */
export const deleteChat = async (id) => {
  try {
    // Corrected endpoint
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete chat.');
    return await response.json();
  } catch (error) {
    console.error("Error deleting chat:", error);
    return null;
  }
};