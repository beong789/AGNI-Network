// ChatAssistant.tsx
import React, { useState } from 'react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, from: 'user' }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Hello! How can I help you today?', from: 'bot' }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-72 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span>Assistant</span>
            <button onClick={() => setIsOpen(false)} className="font-bold">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md text-sm max-w-[80%] ${
                  msg.from === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-200 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
