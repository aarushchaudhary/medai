import React from 'react';
import Loader from '../common/Loader';
import ReactMarkdown from 'react-markdown';
// --- NEW ICONS ---
// Using react-icons for consistency and cleaner code
import { FiPlusCircle, FiUser } from 'react-icons/fi'; 

const Message = ({ message }) => {
  const { text, sender, image, isTyping } = message;
  const isUser = sender === 'user';
  const isBot = sender === 'bot' || sender === 'ai'; // Handle both 'bot' and 'ai' as the sender

  // Typing indicator
  if (isTyping) {
    return (
      <div className="flex items-start gap-4 my-4">
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center">
            {/* Using react-icon for bot */}
            <FiPlusCircle className="text-white" size={24} />
        </div>
        <div className="p-4 rounded-xl max-w-lg bg-gray-200 rounded-bl-none">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
      {/* Bot Icon */}
      {isBot && (
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center">
          {/* Using react-icon for bot */}
          <FiPlusCircle className="text-white" size={24} />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`p-4 rounded-xl max-w-lg ${
          isUser 
          ? 'bg-[#d2232a] text-white rounded-br-none' 
          : 'bg-gray-200 text-[#231f20] rounded-bl-none'
        }`}>
        
        {/* Conditionally render the image if a URL exists */}
        {image && <img src={image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />}
        
        {/* Render text only if it's not empty */}
        {text && (
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
            {/* Using react-icon for user */}
            <FiUser size={24} className="text-white"/>
        </div>
      )}
    </div>
  );
};

export default Message;