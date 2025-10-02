import React, { useState, useRef } from 'react';
import { FiSend, FiUpload, FiXCircle } from 'react-icons/fi'; // Using react-icons for consistency

const ChatInput = ({ onSend }) => { // Removed onFileUpload as it's handled internally
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleSend = () => {
    // Prevent sending if both text and image are empty
    if (input.trim() === '' && !image) return;
    
    // The onSend prop now expects an object with text and image
    onSend({ text: input, image: image });

    // Reset state after sending
    setInput('');
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear the file input
    }
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
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear the file input
    }
  };

  return (
    <footer className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="bg-white border border-gray-300 rounded-lg p-2 max-w-5xl mx-auto">
        {/* Image Preview Section */}
        {imagePreview && (
          <div className="p-2">
            <div className="relative inline-block">
              <img src={imagePreview} alt="Selected preview" className="h-24 w-24 object-cover rounded-md" />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <FiXCircle size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Text Input and Action Buttons */}
        <div className="flex items-center">
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
            <FiUpload size={24} />
          </button>
          <button onClick={handleSend} className="p-2 text-gray-500 hover:text-[#d2232a] transition-colors">
            <FiSend size={24} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;