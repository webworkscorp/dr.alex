import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Minus, Send, Activity } from 'lucide-react';
import { sendMessageToGemini } from '../services/gemini';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bienvenido al espacio del Dr. Alex. ¿En qué puedo orientarle hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión. Inténtelo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div 
        className={`bg-white w-80 sm:w-96 mb-6 transition-all duration-500 origin-bottom-right shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col ${
          isOpen ? 'opacity-100 translate-y-0 h-[450px]' : 'opacity-0 translate-y-10 h-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-900 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500 flex items-center justify-center rounded-full">
                <Activity size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-serif text-white text-lg italic leading-none">Asistente</h3>
              <p className="text-[10px] uppercase text-slate-400 tracking-widest mt-1">Clínica Dr. Alex</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-slate-400 hover:text-white transition-colors">
            <Minus size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] text-sm leading-relaxed p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 border border-slate-100 text-slate-400 text-xs tracking-widest uppercase rounded-full animate-pulse">
                Procesando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escriba su consulta..."
            className="flex-1 bg-slate-50 border-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder-slate-400 rounded-lg transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-sky-500 text-white p-3 hover:bg-sky-600 disabled:opacity-50 transition-colors rounded-lg"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`group bg-slate-900 text-white w-14 h-14 flex items-center justify-center shadow-lg hover:bg-sky-500 transition-all duration-500 rounded-full ${
          isOpen ? 'opacity-0 pointer-events-none rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
};
