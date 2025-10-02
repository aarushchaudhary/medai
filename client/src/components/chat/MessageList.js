import React, { useRef, useEffect } from 'react';
import Message from './Message';
import Loader from '../common/Loader';

const MessageList = ({ messages, isTyping }) => {
  const chatEndRef = useRef(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      {isTyping && <Message message={{ sender: 'bot', isTyping: true }} />}
      <div ref={chatEndRef} />
    </main>
  );
};

export default MessageList;
