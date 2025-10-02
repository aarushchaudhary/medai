import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
// Updated imports to include the new image upload service
import { sendMessageToServer, uploadImageAndMessageToServer, saveChatToServer } from '../services/api';

const ChatDashboard = ({ onChatSaved, initialMessages }) => {
  const defaultInitialMessage = [{ text: "Hello! I am MedAI, your assistant for all medical needs. How can I help you today?", sender: "bot" }];
  const [messages, setMessages] = useState(defaultInitialMessage);
  const [isTyping, setIsTyping] = useState(false);
  const hasBeenSaved = useRef(false);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      hasBeenSaved.current = true;
    }
  }, [initialMessages]);

  // --- UPDATED handleSend FUNCTION ---
  // Now accepts an object with { text, image }
  const handleSend = async ({ text, image }) => {
    // Create the user message object for immediate display
    const userMessage = {
      sender: 'user',
      text: text,
      // Use a local blob URL for instant preview
      image: image ? URL.createObjectURL(image) : null
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    hasBeenSaved.current = false;

    try {
        let responseData;
        if (image) {
            // If there's an image, create FormData and call the upload service
            const formData = new FormData();
            formData.append('image', image);
            formData.append('message', text);
            responseData = await uploadImageAndMessageToServer(formData);
            
            // Update the user message with the permanent URL from the server
            userMessage.image = `http://localhost:5000${responseData.imageUrl}`;
        } else {
            // Otherwise, send a normal text message
            responseData = await sendMessageToServer(text);
        }

        const aiMessage = { sender: 'bot', text: responseData.reply };
        
        // Update the message list, ensuring the user message has the permanent image URL
        setMessages(prevMessages => [...prevMessages.filter(m => m !== userMessage), userMessage, aiMessage]);

    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleSaveChat = async () => {
    if (messages.length < 2) {
      alert('There is nothing to save yet.');
      return;
    }
    try {
      await saveChatToServer(messages);
      hasBeenSaved.current = true;
      alert('Chat saved successfully!');
      if (onChatSaved) {
        onChatSaved();
      }
    } catch (error) {
      alert('Failed to save chat. Please try again.');
      console.error('Error saving chat:', error);
    }
  };

  const handleNewChat = async () => {
    if (messages.length > 1 && !hasBeenSaved.current) {
      const confirmSave = window.confirm("You have unsaved changes. Do you want to save before starting a new chat?");
      if (confirmSave) {
        await handleSaveChat();
      }
    }
    setMessages(defaultInitialMessage);
    hasBeenSaved.current = false;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <MessageList messages={messages} isTyping={isTyping} />

      <div className="p-4 bg-white border-t border-gray-200">
        {/* The onFileUpload prop is no longer needed */}
        <ChatInput onSend={handleSend} />
        
        <div className="flex items-center justify-end space-x-2 mt-2">
          <button
            onClick={handleSaveChat}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Save Chat
          </button>
          <button 
            onClick={handleNewChat}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#d2232a] rounded-md hover:bg-red-700 transition-colors"
          >
            + New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;