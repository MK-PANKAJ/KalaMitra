import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { chatbotService, ChatMessage } from '../utils/chatbotService';
import { useApp } from '../context/AppContext';

export const LiveChatWidget: React.FC = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = state.user?.id || 'guest-user';

  // Load session on mount
  useEffect(() => {
    const session = chatbotService.getSession(userId);
    if (session) {
      setMessages(session.messages);
    }
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(userId, userMessage);
      const session = chatbotService.getSession(userId);
      if (session) {
        setMessages([...session.messages]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedAction = async (action: string) => {
    const actionMessages: Record<string, string> = {
      track_order: 'How can I track my order?',
      payment: 'What payment methods do you accept?',
      returns: 'What is your return policy?',
      qc: 'What does the QC badge mean?',
      discount: 'Are there any discounts available?'
    };

    const message = actionMessages[action] || action;
    setInput(message);
    await handleSend();
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
          aria-label="Open chat"
        >
          <MessageCircle size={24} className="group-hover:animate-bounce" />
          <span className="hidden group-hover:inline-block text-sm font-semibold pr-2 animate-fade-in">
            Need Help?
          </span>
        </button>
      </div>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
        } flex flex-col overflow-hidden border border-gray-200`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-indigo-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm">KalaMitra Support</h3>
              <p className="text-xs text-indigo-100">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages - Hidden when minimized */}
        {!isMinimized && (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="font-semibold">Welcome to KalaMitra!</p>
                  <p className="text-sm mt-1">How can we help you today?</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  {msg.role === 'assistant' && msg.suggestedActions && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedAction(action.action)}
                          className="text-xs bg-white hover:bg-gray-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:border-indigo-300 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Press Enter to send
              </p>
            </div>
          </>
        )}

        {/* Minimized state */}
        {isMinimized && (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
            Chat minimized
          </div>
        )}
      </div>
    </div>
  );
};
