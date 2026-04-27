"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! Welcome to Sipwar. I am SipBot, your AI coffee concierge. How can I help you discover the perfect brew today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: "That sounds wonderful! Our Filter Coffee Arabica AA combines intense aroma with health benefits. You can find it right on our homepage or in the shop." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl w-80 md:w-96 rounded-3xl overflow-hidden shadow-2xl border border-coffee-200/50 mb-4 transform origin-bottom-right transition-all animate-in zoom-in-95 duration-200 flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-900 to-coffee-800 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight text-white">SipBot</h3>
                <p className="text-xs text-coffee-100 font-medium tracking-wide">Online • AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 p-5 overflow-y-auto bg-coffee-50/30 flex flex-col gap-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-coffee-800 text-white rounded-br-sm' : 'bg-white border border-coffee-100 text-coffee-900 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-4 bg-white border-t border-coffee-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SipBot..." 
                className="w-full bg-coffee-50 border border-coffee-200 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all text-coffee-900 placeholder:text-coffee-300 font-medium"
              />
              <button type="submit" disabled={!input.trim()} className="absolute right-1 w-10 h-10 bg-coffee-800 hover:bg-coffee-900 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-coffee-800 disabled:cursor-not-allowed border-[3px] border-white">
                <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
              </button>
            </form>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto w-16 h-16 bg-gradient-to-tr from-coffee-900 to-coffee-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_30px_rgba(74,59,50,0.4)] hover:-translate-y-1 transition-all outline-none border-2 border-white/20 group animate-in zoom-in"
        >
          <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}
    </div>
  );
}
