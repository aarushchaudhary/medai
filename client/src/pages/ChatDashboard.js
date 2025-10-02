import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import { sendMessageToServer, saveChatToServer } from '../services/api';

// Accept a new prop 'initialMessages'
const ChatDashboard = ({ onChatSaved, initialMessages }) => {
  const defaultInitialMessage = [{ text: "Hello! I am MedAI, your assistant for all medical needs. How can I help you today?", sender: "bot" }];
  const [messages, setMessages] = useState(defaultInitialMessage);
  const [isTyping, setIsTyping] = useState(false);
  const hasBeenSaved = useRef(false);

  // This useEffect hook will run whenever a new chat is selected from the history
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      hasBeenSaved.current = true; // A loaded chat is considered "saved"
    }
  }, [initialMessages]);

  const handleSend = async (messageText) => {
    const userMessage = { sender: 'user', text: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    hasBeenSaved.current = false; // Sending a new message makes the chat unsaved

    try {
      const reply = await sendMessageToServer(messageText);
      const aiMessage = { sender: 'bot', text: reply };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Sorry, something went wrong.' };
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
      // Notify the parent component (App.js) to refresh the history list
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
    // Reset the chat to the initial welcome message
    setMessages(defaultInitialMessage);
    hasBeenSaved.current = false;
  };

  const handleFileUpload = (file) => {
    console.log('File upload initiated for:', file.name);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <MessageList messages={messages} isTyping={isTyping} />

      <div className="p-4 bg-white border-t border-gray-200">
        <ChatInput onSend={handleSend} onFileUpload={handleFileUpload} />
        
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
