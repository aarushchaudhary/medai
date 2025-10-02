import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This will be replaced by a prop or a state management hook later.
  const chats = []; 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 p-4 bg-white shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Hamburger Menu Button */}
          <button onClick={toggleMenu} className="p-2 rounded-md text-[#58595b] hover:bg-gray-100 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#d2232a] rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
            </div>
            <div>
              {/* --- TEXT UPDATED HERE --- */}
              <h1 className="text-xl font-bold text-[#231f20]">MedAI</h1>
              <p className="text-sm text-[#58595b]">AI Assistant for all medical needs</p>
            </div>
          </div>
          
          {/* A spacer to keep the title centered */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* Slide-out Menu and Backdrop */}
      <div className={`fixed inset-0 z-60 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={toggleMenu}></div>
        
        {/* Menu Panel */}
        <div className={`relative flex flex-col h-full w-72 bg-white shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-[#231f20]">Chat History</h2>
            </div>
            <nav className="flex-1 p-2 space-y-1">
                {chats.length > 0 ? (
                    chats.map(chat => (
                        <a href="#" key={chat.id} className="block px-4 py-2 text-sm text-[#58595b] rounded-md hover:bg-gray-100 hover:text-[#231f20]">
                            {chat.title}
                        </a>
                    ))
                ) : (
                    <div className="p-4 text-sm text-gray-500">
                        No saved chats.
                    </div>
                )}
            </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

