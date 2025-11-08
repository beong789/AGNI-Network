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
        <div className="w-72 h-96 bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 rounded-lg shadow-lg flex flex-col overflow-hidden text-white">
          <div className="bg-red-700 px-4 py-2 flex justify-between items-center font-bold">
            <span>AGNI</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl font-bold cursor-pointer">×</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md text-sm max-w-[80%] ${
                  msg.from === 'user'
                    ? 'bg-red-200 text-red-900 self-end'
                    : 'bg-orange-100 text-orange-900 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-red-400 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 text-black"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={handleClick}
          className={`fire-button w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer text-lg ${
            burst ? 'burst' : ''
          }`}
        >
          🔥
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
