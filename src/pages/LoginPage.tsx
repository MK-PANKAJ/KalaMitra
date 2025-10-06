import React, { useState } from 'react';
import { Palette, Globe, Mail, Lock, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { backendService } from '../services/backendService';

export const LoginPage: React.FC = () => {
  const { dispatch } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('artisan');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await backendService.login(email, password);
      
      if (user) {
        // Clear existing data first
        dispatch({ type: 'CLEAR_DATA' });
        
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load user-specific data from backend
        const products = await backendService.getProducts(user.id, user.role);
        const orders = await backendService.getOrders(user.id, user.role);
        const disputes = await backendService.getDisputes(user.id, user.role);
        
        products.forEach(p => dispatch({ type: 'ADD_PRODUCT', payload: p }));
        orders.forEach(o => dispatch({ type: 'ADD_ORDER', payload: o }));
        disputes.forEach(d => dispatch({ type: 'ADD_DISPUTE', payload: d }));
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await backendService.register(name, email, password, role, region);
      
      if (user) {
        // Clear existing data first
        dispatch({ type: 'CLEAR_DATA' });
        
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load demo data for new users
        await backendService.loadDemoData();
        
        // Load user-specific data from backend
        const products = await backendService.getProducts(user.id, user.role);
        const orders = await backendService.getOrders(user.id, user.role);
        const disputes = await backendService.getDisputes(user.id, user.role);
        
        products.forEach(p => dispatch({ type: 'ADD_PRODUCT', payload: p }));
        orders.forEach(o => dispatch({ type: 'ADD_ORDER', payload: o }));
        disputes.forEach(d => dispatch({ type: 'ADD_DISPUTE', payload: d }));
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { name: 'Rajesh Kumar', email: 'rajesh@kalamitra.com', password: 'artisan123', role: 'artisan' as UserRole },
    { name: 'Anjali Mehta', email: 'anjali@kalamitra.com', password: 'buyer123', role: 'buyer' as UserRole },
    { name: 'QC Coordinator', email: 'coordinator@kalamitra.com', password: 'coordinator123', role: 'coordinator' as UserRole },
    { name: 'Super Admin', email: 'admin@kalamitra.com', password: 'admin123', role: 'admin' as UserRole },
  ];

  const handleDemoLogin = async (demo: typeof demoUsers[0]) => {
    setLoading(true);
    setError('');
    
    try {
      const user = await backendService.login(demo.email, demo.password);
      
      if (user) {
        // Clear existing data first
        dispatch({ type: 'CLEAR_DATA' });
        
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load demo data
        await backendService.loadDemoData();
        
        // Load user-specific data from backend
        const products = await backendService.getProducts(user.id, user.role);
        const orders = await backendService.getOrders(user.id, user.role);
        const disputes = await backendService.getDisputes(user.id, user.role);
        
        products.forEach(p => dispatch({ type: 'ADD_PRODUCT', payload: p }));
        orders.forEach(o => dispatch({ type: 'ADD_ORDER', payload: o }));
        disputes.forEach(d => dispatch({ type: 'ADD_DISPUTE', payload: d }));
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-100 via-terracotta-50 to-gold-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-terracotta-600 to-deepblue-700 rounded-2xl p-8 text-white flex flex-col justify-center shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={48} className="text-gold-300" />
            <h1 className="text-4xl font-bold">KalaMitra</h1>
          </div>
          <p className="text-xl mb-4 text-terracotta-50">
            Empowering Indian Artisans with AI & Voice Technology
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gold-300 text-xl">🎤</span>
              <span>Voice-first product listing in Hindi & English</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-300 text-xl">🤖</span>
              <span>AI-powered storytelling & fair pricing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-300 text-xl">✅</span>
              <span>Quality control with trusted badges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-300 text-xl">🛡️</span>
              <span>Secure payments & dispute resolution</span>
            </div>
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-deepblue-800">
              {isRegistering ? 'Create Account' : 'Welcome! नमस्ते!'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm text-terracotta-600 hover:text-terracotta-700 font-semibold"
            >
              {isRegistering ? 'Sign In' : 'Create Account'}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                required
                minLength={6}
              />
            </div>

            {isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['artisan', 'buyer'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          role === r
                            ? 'bg-terracotta-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {r === 'artisan' ? '🎨 Artisan' : r === 'buyer' ? '🛍️ Buyer' : '⚖️ Coordinator'}
                      </button>
                    ))}
                  </div>
                </div>

                {role === 'artisan' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g., Jaipur, Rajasthan"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 bg-gradient-to-r from-terracotta-500 to-saffron-500 text-white rounded-lg hover:from-terracotta-600 hover:to-saffron-600 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isRegistering ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isRegistering ? <UserPlus size={20} /> : <Mail size={20} />}
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {!isRegistering && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 font-semibold">Quick Demo Login:</p>
              <div className="space-y-2">
                {demoUsers.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDemoLogin(demo)}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left text-sm transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{demo.name}</span>
                        <span className="text-gray-600"> • {demo.role}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {demo.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                All demo accounts use simple passwords for testing
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
