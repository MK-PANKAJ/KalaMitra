import React, { useState } from 'react';
import { MessageCircle, Search, ArrowLeft, Plus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatBox } from '../components/ChatBox';
import { Conversation, Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const userConversations = state.conversations.filter(conv =>
    conv.participants.includes(state.user!.id)
  );

  const filteredConversations = userConversations.filter(conv => {
    // Get other participant's name
    const otherParticipantId = conv.participants.find(id => id !== state.user!.id);
    const otherUser = state.products.find(p => p.artisanId === otherParticipantId);
    
    if (!searchQuery) return true;
    return otherUser?.artisanName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get all platform users (artisans, coordinators, admins) for messaging
  const getAllPlatformUsers = (): Array<{id: string, name: string, email: string, role: 'artisan' | 'coordinator' | 'admin'}> => {
    const platformUsers: Array<{id: string, name: string, email: string, role: 'artisan' | 'coordinator' | 'admin'}> = [];
    
    // Add artisans from products
    state.products.forEach(product => {
      if (!platformUsers.find(u => u.id === product.artisanId)) {
        platformUsers.push({
          id: product.artisanId,
          name: product.artisanName,
          email: `${product.artisanName.toLowerCase().replace(' ', '.')}@kalamitra.com`,
          role: 'artisan' as const,
        });
      }
    });
    
    // In a real app, you'd fetch all users from backend
    // For now, we'll use demo data pattern
    if (platformUsers.length === 0) {
      platformUsers.push(
        { id: 'artisan-1', name: 'Rajesh Kumar', email: 'rajesh@kalamitra.com', role: 'artisan' },
        { id: 'coordinator-1', name: 'QC Coordinator', email: 'coordinator@kalamitra.com', role: 'coordinator' },
        { id: 'admin-1', name: 'Super Admin', email: 'admin@kalamitra.com', role: 'admin' }
      );
    }
    
    return platformUsers;
  };

  const platformUsers: Array<{id: string, name: string, email: string, role: 'artisan' | 'coordinator' | 'admin'}> = getAllPlatformUsers();

  const filteredUsers = platformUsers.filter(user => {
    if (!userSearchQuery) return true;
    return (
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }).filter(user => user.id !== state.user!.id); // Exclude current user

  const startNewConversation = (user: typeof platformUsers[0]) => {
    // Check if conversation already exists
    const existingConversation = state.conversations.find(conv =>
      conv.participants.includes(state.user!.id) &&
      conv.participants.includes(user.id)
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
      setShowUserSearch(false);
      return;
    }
    
    // Create new conversation
    const conversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: conversationId,
      participants: [state.user!.id, user.id],
      productId: undefined,
      lastMessage: undefined,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
    setSelectedConversation(newConversation);
    setShowUserSearch(false);
  };

  const handleSendMessage = (conversationId: string, content: string, attachments?: string[]) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const otherParticipantId = conversation.participants.find(id => id !== state.user!.id);
    if (!otherParticipantId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: state.user!.id,
      senderName: state.user!.name,
      senderRole: state.user!.role,
      receiverId: otherParticipantId,
      content,
      attachments,
      read: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

    // Update conversation's last message
    const updatedConversation: Conversation = {
      ...conversation,
      lastMessage: newMessage,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CONVERSATION', payload: updatedConversation });
  };

  const getConversationDisplay = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== state.user!.id);
    
    // Try to find user in products (artisans) or orders (buyers)
    let otherUser: { name: string; role: string } | null = null;
    
    const artisan = state.products.find(p => p.artisanId === otherParticipantId);
    if (artisan) {
      otherUser = { name: artisan.artisanName, role: 'artisan' };
    } else {
      const order = state.orders.find(o => o.buyerId === otherParticipantId || o.artisanId === otherParticipantId);
      if (order) {
        otherUser = {
          name: order.buyerId === otherParticipantId ? order.buyerName : order.artisanName,
          role: order.buyerId === otherParticipantId ? 'buyer' : 'artisan',
        };
      }
    }

    return {
      id: otherParticipantId || 'unknown',
      name: otherUser?.name || 'Unknown User',
      role: otherUser?.role || 'user',
    };
  };

  const getProductContext = (conversation: Conversation) => {
    if (conversation.productId) {
      const product = state.products.find(p => p.id === conversation.productId);
      if (product) {
        return {
          id: product.id,
          name: product.name,
          photo: product.photos[0],
        };
      }
    }
    return undefined;
  };

  if (selectedConversation) {
    const conversationMessages = state.messages.filter(
      m => m.conversationId === selectedConversation.id
    );
    const otherUser = getConversationDisplay(selectedConversation);
    const productContext = getProductContext(selectedConversation);

    return (
      <div className="h-[calc(100vh-200px)]">
        <button
          onClick={() => setSelectedConversation(null)}
          className="mb-4 px-4 py-2 flex items-center gap-2 text-deepblue-600 hover:text-deepblue-800 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Conversations
        </button>
        <ChatBox
          messages={conversationMessages}
          currentUser={state.user!}
          otherUser={otherUser}
          onSendMessage={(content, attachments) =>
            handleSendMessage(selectedConversation.id, content, attachments)
          }
          productContext={productContext}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-deepblue-600 to-terracotta-500 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MessageCircle size={32} />
          Messages
        </h1>
        <p className="text-blue-50">Connect with artisans, coordinators, and administrators</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
            />
          </div>
          <button
            onClick={() => setShowUserSearch(true)}
            className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            New Message
          </button>
        </div>
      </div>

      {/* User Search Interface */}
      {showUserSearch && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Start New Conversation</h3>
            <button
              onClick={() => {
                setShowUserSearch(false);
                setUserSearchQuery("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => startNewConversation(user)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-terracotta-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                  {user.role}
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && userSearchQuery && (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No users found matching "{userSearchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => {
            const otherUser = getConversationDisplay(conversation);
            const productContext = getProductContext(conversation);

            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-terracotta-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-terracotta-500 flex items-center justify-center text-white font-bold text-lg">
                    {otherUser.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-deepblue-800">{otherUser.name}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessage.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 capitalize mb-2">{otherUser.role}</p>

                    {productContext && (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-saffron-50 rounded">
                        <img
                          src={productContext.photo}
                          alt={productContext.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-xs text-gray-600">{productContext.name}</span>
                      </div>
                    )}

                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {conversation.lastMessage.senderId === state.user!.id && 'You: '}
                        {conversation.lastMessage.content || '[Photo]'}
                      </p>
                    )}

                    {conversation.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-block bg-terracotta-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {conversation.unreadCount} new
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-semibold text-gray-700 mb-2">No conversations yet</p>
          <p className="text-gray-500 mb-4">
            Start a conversation by messaging an artisan from a product page
          </p>
        </div>
      )}
    </div>
  );
};
