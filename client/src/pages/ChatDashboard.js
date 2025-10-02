import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import { sendMessageToServer, uploadImageToServer, saveChatToServer } from '../services/api';

const ChatDashboard = () => {
  const initialMessage = { text: "Hello! I am MedAI, your assistant for all medical needs. How can I help you today?", sender: "bot" };
  
  const [messages, setMessages] = useState([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to track if the chat has been saved to prevent multiple saves
  const hasBeenSaved = useRef(false);

  // --- AUTO-SAVE ON EXIT (Optional: Uncomment to enable) ---
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (messages.length > 1 && !hasBeenSaved.current) {
  //       saveChatToServer(messages);
  //     }
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [messages]);

  const handleSend = async (inputText) => {
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const botReply = await sendMessageToServer(inputText);
    const botMessage = { text: botReply, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleFileUpload = (file) => {
    // ... (keep your existing file upload logic) ...
  };

  /**
   * --- NEW FUNCTION ---
   * Handles starting a new chat session. It saves the old one first.
   */
  const handleNewChat = async () => {
    // Save the current chat if it has content and hasn't been saved yet
    if (messages.length > 1 && !hasBeenSaved.current) {
      await saveChatToServer(messages);
    }
    // Reset the chat to its initial state
    setMessages([initialMessage]);
    hasBeenSaved.current = false;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      {/* --- NEW CHAT BUTTON ADDED --- */}
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <button 
          onClick={handleNewChat}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#d2232a] rounded-md hover:bg-red-700 transition-colors"
        >
          + New Chat
        </button>
      </div>

      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput onSend={handleSend} onFileUpload={handleFileUpload} />
    </div>
  );
};

export default ChatDashboard;
