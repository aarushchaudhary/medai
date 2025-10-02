import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatDashboard from './pages/ChatDashboard';
import { getChatHistory, getChatById, updateChat, deleteChat } from './services/api';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatMessages, setCurrentChatMessages] = useState(null);

  // Function to fetch and update the list of chat titles
  const fetchHistory = async () => {
    const history = await getChatHistory();
    setChatHistory(history);
  };

  // Fetch the initial chat history when the app loads
  useEffect(() => {
    fetchHistory();
  }, []);

  // Handles loading a chat when a user clicks on it in the history
  const handleChatSelect = async (id) => {
    const selectedChat = await getChatById(id);
    if (selectedChat) {
      // Update the state with the messages from the selected chat
      setCurrentChatMessages(selectedChat.messages);
    }
  };
  
  // Handles renaming a chat
  const handleRenameChat = async (id, newTitle) => {
    await updateChat(id, { title: newTitle });
    fetchHistory(); // Refresh the list
  };

  // Handles pinning or unpinning a chat
  const handlePinChat = async (id, currentStatus) => {
    await updateChat(id, { pinned: !currentStatus });
    fetchHistory(); // Refresh the list
  };

  // Handles deleting a chat
  const handleDeleteChat = async (id) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(id);
      fetchHistory(); // Refresh the list
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-[#231f20] font-sans">
      {/* Header is restored and passed all necessary functions */}
      <Header
        chats={chatHistory}
        onChatSelect={handleChatSelect}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-5xl h-full flex flex-col relative">
          {/* Dashboard is passed the right props to receive old chats and notify on save */}
          <ChatDashboard onChatSaved={fetchHistory} initialMessages={currentChatMessages} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
