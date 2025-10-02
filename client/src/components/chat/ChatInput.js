import React, { useState, useRef } from 'react';

const ChatInput = ({ onSend, onFileUpload }) => {
  const [input, setInput] = useState('');
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    onSend(input);
    setInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <footer className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 max-w-5xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your situation or ask a question..."
          className="flex-1 bg-transparent text-[#231f20] placeholder-gray-500 focus:outline-none px-2 resize-none"
          rows="1"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-[#d2232a] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        </button>
        <button onClick={handleSend} className="p-2 text-gray-500 hover:text-[#d2232a] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </footer>
  );
};

export default ChatInput;

