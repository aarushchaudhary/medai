import React, { useState } from 'react';

const Header = ({
  chats = [],
  onChatSelect,
  onRenameChat,
  onPinChat,
  onDeleteChat
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleItemClick = (id) => {
    // Don't load a chat if the user is in the middle of renaming it.
    if (renamingId === id) return;
    onChatSelect?.(id);
    toggleMenu(); // Close the menu after selecting a chat
  };

  // When the user clicks the rename icon, set the state to show the input field.
  const handleRenameClick = (chat) => {
    setRenamingId(chat._id);
    setTempTitle(chat.title);
  };

  // When the user is done renaming (e.g., clicks away or hits Enter).
  const handleRenameSubmit = () => {
    if (tempTitle && renamingId) {
      onRenameChat?.(renamingId, tempTitle);
    }
    // Reset the renaming state.
    setRenamingId(null);
    setTempTitle('');
  };

  // Handle keyboard events for the rename input.
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleRenameSubmit();
    } else if (event.key === 'Escape') {
      setRenamingId(null);
      setTempTitle('');
    }
  };
  
  // A small sub-component to keep the main return statement clean.
  const ChatItem = ({ chat }) => (
    <div className="group flex items-center justify-between px-4 py-2 text-sm text-[#58595b] rounded-md hover:bg-gray-100">
      {renamingId === chat._id ? (
        // Show an input field if this item is being renamed.
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={handleRenameSubmit} // Submit when the input loses focus
          onKeyDown={handleKeyDown}   // Submit on Enter, cancel on Escape
          className="flex-grow bg-transparent border-b border-blue-500 focus:outline-none"
          autoFocus // Automatically focus the input field
        />
      ) : (
        // Otherwise, show the chat title as a button.
        <button
          onClick={() => handleItemClick(chat._id)}
          className="flex-grow text-left truncate"
        >
          {chat.title}
        </button>
      )}

      {/* Action icons appear on hover over the chat item */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Pin Button */}
        <button onClick={() => onPinChat?.(chat._id, chat.pinned)} title={chat.pinned ? "Unpin Chat" : "Pin Chat"}>
          {chat.pinned ? '📌' : <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.176A4.5 4.5 0 0 1 5 6.708V2.277a2.7 2.7 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001.002.001m-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447l-.078.048v.01a5 5 0 0 0 1.946 2.527l.098.065V10.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1-.5-.5H5a.5.5 0 0 1-.5-.5c0-.485.345-.898.745-1.138a3.5 3.5 0 0 0 1.255-.816V2a.5.5 0 0 1 .146-.354"/></svg>}
        </button>
        {/* Rename Button */}
        <button onClick={() => handleRenameClick(chat)} title="Rename Chat">✏️</button>
        {/* Delete Button */}
        <button onClick={() => onDeleteChat?.(chat._id)} title="Delete Chat" className="text-red-500">🗑️</button>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-20 p-4 bg-white shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={toggleMenu} className="p-2 rounded-md text-[#58595b] hover:bg-gray-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#d2232a] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#231f20]">MedAI</h1>
                    <p className="text-sm text-[#58595b]">AI Assistant for all medical needs</p>
                </div>
            </div>
            <div className="w-10"></div>
        </div>
      </header>

      {/* Slide-out Menu and Backdrop */}
      <div className={`absolute inset-0 z-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60" onClick={toggleMenu}></div>
        <div className={`relative flex flex-col h-full w-80 bg-white shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-[#231f20]">Chat History</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {chats && chats.length > 0 ? (
              chats.map(chat => <ChatItem key={chat._id} chat={chat} />)
            ) : (
              <div className="p-4 text-sm text-gray-500">No saved chats.</div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

