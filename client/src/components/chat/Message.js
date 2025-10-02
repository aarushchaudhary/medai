import React from 'react';
import Loader from '../common/Loader';
import ReactMarkdown from 'react-markdown';

const Message = ({ message }) => {
  const { text, sender, image, isTyping } = message;
  const isUser = sender === 'user';

  // Typing indicator with the new bot icon
  if (isTyping) {
    return (
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center">
            {/* --- BOT ICON UPDATED --- */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <div className="p-4 rounded-xl max-w-lg bg-gray-200 rounded-bl-none">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {/* Bot Icon */}
      {!isUser && (
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center">
            {/* --- BOT ICON UPDATED --- */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`p-4 rounded-xl max-w-lg ${
          isUser 
          ? 'bg-[#d2232a] text-white rounded-br-none' 
          : 'bg-gray-200 text-[#231f20] rounded-bl-none'
        }`}>
        {image && <img src={image} alt="uploaded content" className="rounded-lg mb-2 max-w-xs" />}
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-10 h-10 bg-[#58595b] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
            {/* --- USER ICON UPDATED --- */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      )}
    </div>
  );
};

export default Message;