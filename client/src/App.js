import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatDashboard from './pages/ChatDashboard';

function App() {
  return (
    // Change background, and set the default text color for the app
    <div className="flex flex-col h-screen bg-gray-100 text-[#231f20] font-sans">
        <Header />
        <div className="flex-grow p-4 overflow-hidden">
            <ChatDashboard />
        </div>
        <Footer />
    </div>
  );
}

export default App;