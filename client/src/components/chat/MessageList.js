import React, { useEffect, useRef } from 'react';
import Message from './Message';
// --- FIX ---
// The 'Loader' component is no longer used directly in this file, so its import has been removed.

const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isTyping && <Message message={{ sender: 'bot', isTyping: true }} />}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default MessageList;