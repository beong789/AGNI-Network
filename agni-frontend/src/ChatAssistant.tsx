import React, { useState } from 'react';
import { API_BASE_URL } from './services/api.ts'
import './fireAnimation.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [burst, setBurst] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleClick = () => {
    setBurst(true);
    setTimeout(() => {
      setBurst(false);
      setIsOpen(true);
    }, 500); 
  };
  
  const handleSend = async () => {
  if (!input.trim()) return;

  setMessages(prev => [...prev, { text: input, from: 'user' }]);
  const userMessage = input;
  setInput('');

  setMessages(prev => [...prev, { text: "🔥 AGNI is thinking...", from: 'bot' }]);

  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();

    setMessages(prev => prev.filter(msg => msg.text !== "🔥 AGNI is thinking..."));

    setMessages(prev => [...prev, { text: data.response, from: 'bot' }]);
  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, { text: "⚠️ Something went wrong", from: 'bot' }]);
  }
};


  return (
    <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
        <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-orange-500">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
            <img 
                src="/agni-mascot.svg" 
                alt="AGNI" 
                className="w-12 h-12 hover:scale-110 transition-transform duration-300" 
                style={{ animation: 'wiggle 2s ease-in-out infinite' }}
              />
              <span className="text-white font-bold text-lg">AGNI Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white text-2xl font-bold cursor-pointer hover:scale-110 transition-transform hover:rotate-90 duration-300"
            >
              ×
            </button>
          </div>

          {/* Messages area with better spacing */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-orange-50 to-red-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-sm">Ask me anything regarding fire risk!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-md ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-orange-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input area with better styling */}
          <div className="p-4 bg-white border-t-2 border-orange-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about fire safety..."
              className="flex-1 border-2 border-orange-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-2 rounded-full hover:from-red-700 hover:to-orange-600 active:scale-95 active:shadow-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"            >
              Send
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={handleClick}
          className={`fire-button w-20 h-20 rounded-full shadow-2xl flex items-center justify-center cursor-pointer text-lg hover:scale-110 transition-transform transition-all duration-300 ease-out ${
            burst ? 'burst' : ''
          }`}
        >
          <img src="/agni-mascot.svg" alt="AGNI" className="w-28 h-28" />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
