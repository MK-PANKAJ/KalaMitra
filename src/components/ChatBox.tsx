import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Message, User } from '../types';

interface ChatBoxProps {
  messages: Message[];
  currentUser: User;
  otherUser: { id: string; name: string; role: string };
  onSendMessage: (content: string, attachments?: string[]) => void;
  productContext?: { id: string; name: string; photo: string };
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  currentUser,
  otherUser,
  onSendMessage,
  productContext,
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddAttachment = () => {
    if (attachmentInput.trim() && attachments.length < 3) {
      setAttachments([...attachments, attachmentInput.trim()]);
      setAttachmentInput('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (messageText.trim() || attachments.length > 0) {
      onSendMessage(messageText.trim(), attachments.length > 0 ? attachments : undefined);
      setMessageText('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-deepblue-600 to-terracotta-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-deepblue-600 font-bold">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-white">
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-sm text-blue-100 capitalize">{otherUser.role}</p>
          </div>
        </div>
        
        {productContext && (
          <div className="mt-3 p-2 bg-white bg-opacity-20 rounded-lg flex items-center gap-2">
            <img
              src={productContext.photo}
              alt={productContext.name}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 text-white">
              <p className="text-xs opacity-80">Inquiry about:</p>
              <p className="text-sm font-semibold">{productContext.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-terracotta-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <img
                          key={idx}
                          src={attachment}
                          alt={`Attachment ${idx + 1}`}
                          className="w-full rounded border-2 border-white border-opacity-20"
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex gap-2">
            {attachments.map((attachment, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={attachment}
                  alt={`Attachment ${idx + 1}`}
                  className="w-16 h-16 rounded border-2 border-gray-300 object-cover"
                />
                <button
                  onClick={() => handleRemoveAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Attachment Input */}
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={attachmentInput}
            onChange={(e) => setAttachmentInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAttachment();
              }
            }}
            placeholder="Image URL (optional)"
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
          />
          <button
            onClick={handleAddAttachment}
            disabled={attachments.length >= 3}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paperclip size={16} />
          </button>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() && attachments.length === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              messageText.trim() || attachments.length > 0
                ? 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
            Send
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Tip: Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
