import React, { useState, useEffect } from 'react';
import { LogOut, Volume2, Mic, Globe, MessageCircle, Wallet, BookOpen, Trophy, Briefcase, BarChart3, Building2, Bell, X } from 'lucide-react';
import { useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { ArtisanDashboard } from './pages/ArtisanDashboard';
import { BuyerMarketplace } from './pages/BuyerMarketplace';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { MessagesPage } from './pages/MessagesPage';
import { WalletPage } from './pages/WalletPage';
import { AcademyPage } from './pages/AcademyPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { InternationalSettingsPage } from './pages/InternationalSettingsPage';
import { B2BMarketplacePage } from './pages/B2BMarketplacePage';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { voiceService } from './utils/voiceUtils';
import { LiveChatWidget } from './components/LiveChatWidget';
import { notificationService } from './utils/notificationService';

type PageType = 'dashboard' | 'messages' | 'wallet' | 'academy' | 'achievements' | 'international' | 'b2b' | 'analytics' | 'schemes';

function App() {
  const { state, dispatch } = useApp();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
    dispatch({ type: 'LOGOUT' });
  };

  const handleLanguageToggle = () => {
    const newLang = state.currentLanguage === 'en' ? 'hi' : 'en';
    dispatch({ type: 'SET_LANGUAGE', payload: newLang });
    
    const message = newLang === 'hi' 
      ? 'भाषा हिंदी में बदल गई' 
      : 'Language changed to English';
    
    voiceService.speak(message, newLang);
  };

  // Initialize notifications
  useEffect(() => {
    if (state.user) {
      // Request notification permission
      notificationService.requestPermission();
      
      // Update notification count
      const updateCount = () => {
        const count = notificationService.getUnreadCount(state.user!.id);
        setNotificationCount(count);
      };
      
      updateCount();
      
      // Subscribe to new notifications
      const unsubscribe = notificationService.subscribe(state.user.id, (notification) => {
        updateCount();
      });
      
      return () => unsubscribe();
    }
  }, [state.user]);

  const notifications = state.user ? notificationService.getNotifications(state.user.id, 10) : [];

  if (!state.user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-terracotta-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-terracotta-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-saffron-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                🎨
              </div>
              <div>
                <h1 className="text-2xl font-bold text-deepblue-800">KalaMitra</h1>
                <p className="text-xs text-gray-600">
                  {state.user.role === 'artisan' && '🎨 Artisan Portal'}
                  {state.user.role === 'buyer' && '🛍️ Buyer Marketplace'}
                  {state.user.role === 'coordinator' && '⚖️ Coordinator Dashboard'}
                  {state.user.role === 'admin' && '🛡️ Admin Control Panel'}
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            {state.user && (
              <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    currentPage === 'dashboard'
                      ? 'bg-terracotta-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                
                {state.user.role !== 'admin' && (
                  <button
                    onClick={() => setCurrentPage('messages')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'messages'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle size={16} />
                    Messages
                    {state.conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {state.conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                      </span>
                    )}
                  </button>
                )}
                
                {(state.user.role === 'artisan' || state.user.role === 'buyer') && (
                  <button
                    onClick={() => setCurrentPage('wallet')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'wallet'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Wallet size={16} />
                    Wallet
                  </button>
                )}
                
                {state.user.role !== 'admin' && (
                  <button
                    onClick={() => setCurrentPage('academy')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'academy'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BookOpen size={16} />
                    Academy
                  </button>
                )}
                
                {state.user.role === 'artisan' && (
                  <button
                    onClick={() => setCurrentPage('achievements')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'achievements'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Trophy size={16} />
                    Achievements
                  </button>
                )}
                
                {state.user.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => setCurrentPage('international')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                        currentPage === 'international'
                          ? 'bg-terracotta-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Globe size={16} />
                      Global
                    </button>
                    <button
                      onClick={() => setCurrentPage('b2b')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                        currentPage === 'b2b'
                          ? 'bg-terracotta-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Briefcase size={16} />
                      B2B
                    </button>
                  </>
                )}
                
                {(state.user.role === 'artisan' || state.user.role === 'coordinator' || state.user.role === 'admin') && (
                  <button
                    onClick={() => setCurrentPage('analytics')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'analytics'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 size={16} />
                    Analytics
                  </button>
                )}
                
                {(state.user.role === 'artisan' || state.user.role === 'coordinator') && (
                  <button
                    onClick={() => setCurrentPage('schemes')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                      currentPage === 'schemes'
                        ? 'bg-terracotta-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 size={16} />
                    Schemes
                  </button>
                )}
              </nav>
            )}

            <div className="flex items-center gap-3">
              {/* Voice Status Indicators */}
              {state.isListening && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-full animate-pulse">
                  <Mic size={16} />
                  <span className="text-sm font-semibold">Listening...</span>
                </div>
              )}
              {state.isSpeaking && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full">
                  <Volume2 size={16} />
                  <span className="text-sm font-semibold">Speaking...</span>
                </div>
              )}

              {/* Language Toggle */}
              <button
                onClick={handleLanguageToggle}
                className="flex items-center gap-2 px-4 py-2 bg-deepblue-100 text-deepblue-700 rounded-lg hover:bg-deepblue-200 transition-colors font-semibold"
                title="Toggle Language"
              >
                <Globe size={18} />
                <span className="text-sm">{state.currentLanguage === 'en' ? 'EN' : 'हि'}</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Bell size={18} />
                        Notifications
                      </h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="hover:bg-gray-200 p-1 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              notificationService.markAsRead(notif.id);
                              setNotificationCount(notificationService.getUnreadCount(state.user!.id));
                              if (notif.actionUrl) {
                                window.location.href = notif.actionUrl;
                              }
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-2xl">{notif.icon || '🔔'}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{notif.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            notificationService.markAllAsRead(state.user!.id);
                            setNotificationCount(0);
                          }}
                          className="w-full p-3 text-sm text-blue-600 hover:bg-blue-50 font-semibold"
                        >
                          Mark all as read
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-2 text-gray-300" />
                        <p className="font-semibold">No notifications</p>
                        <p className="text-xs mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="hidden md:block text-right">
                <div className="font-semibold text-deepblue-800">{state.user.name}</div>
                <div className="text-xs text-gray-600">{state.user.region}</div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && (
          <>
            {state.user.role === 'artisan' && <ArtisanDashboard />}
            {state.user.role === 'buyer' && <BuyerMarketplace />}
            {state.user.role === 'coordinator' && <CoordinatorDashboard />}
            {state.user.role === 'admin' && <AdminDashboard />}
          </>
        )}
        {currentPage === 'messages' && <MessagesPage />}
        {currentPage === 'wallet' && <WalletPage />}
        {currentPage === 'academy' && <AcademyPage />}
        {currentPage === 'achievements' && state.user.role === 'artisan' && (
          <AchievementsPage />
        )}
        {currentPage === 'international' && <InternationalSettingsPage />}
        {currentPage === 'b2b' && <B2BMarketplacePage />}
        {currentPage === 'analytics' && (state.user.role === 'artisan' || state.user.role === 'coordinator' || state.user.role === 'admin') && (
          <AnalyticsDashboard />
        )}
        {currentPage === 'schemes' && (state.user.role === 'artisan' || state.user.role === 'coordinator') && (
          <GovernmentSchemesPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-deepblue-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gold-400">KalaMitra</h3>
            <p className="text-sm text-blue-200">Empowering Indian Artisans</p>
          </div>
          <div className="flex justify-center gap-6 text-sm text-blue-200 mb-4">
            <span>🎤 Voice-First</span>
            <span>🤖 AI-Powered</span>
            <span>✅ Quality Assured</span>
            <span>🛡️ Fair Trade</span>
          </div>
          <div className="text-xs text-blue-300">
            © 2025 KalaMitra. Built with ❤️ for Indian artisans.
          </div>
        </div>
      </footer>

      {/* AI Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}

export default App;
