import React, { useState } from 'react';
import { Shield, Users, Package, FileText, Plus, Edit, Trash2, Building2, BarChart3, Settings, BookOpen, Award, Tag, AlertCircle, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { couponService } from '../utils/couponService';

interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  applicationLink: string;
  deadline?: string;
  category: 'finance' | 'training' | 'marketing' | 'export';
  status: 'active' | 'upcoming' | 'closed';
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  craftType: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessons: number;
  thumbnail: string;
  status: 'active' | 'draft' | 'archived';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pointsRequired: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productsCount: number;
}

export const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'schemes' | 'courses' | 'achievements' | 'categories' | 'moderation' | 'analytics' | 'coupons'>('overview');
  
  // Scheme management states
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [newScheme, setNewScheme] = useState<Partial<GovernmentScheme>>({
    name: '',
    ministry: '',
    description: '',
    benefits: [''],
    eligibility: [''],
    applicationLink: '',
    category: 'finance',
    status: 'active',
  });

  // Course management states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', title: 'Introduction to Blue Pottery', description: 'Learn basic pottery', instructor: 'Master Rajesh Kumar', craftType: 'Pottery', level: 'beginner', duration: 120, lessons: 8, thumbnail: '', status: 'active' },
    { id: '2', title: 'Advanced Textile Weaving', description: 'Master textile patterns', instructor: 'Guru Meera Devi', craftType: 'Textile', level: 'advanced', duration: 180, lessons: 12, thumbnail: '', status: 'active' },
    { id: '3', title: 'Jewelry Design Basics', description: 'Learn jewelry making', instructor: 'Artisan Priya Shah', craftType: 'Jewelry', level: 'beginner', duration: 90, lessons: 6, thumbnail: '', status: 'draft' },
    { id: '4', title: 'Woodcarving Techniques', description: 'Wood carving skills', instructor: 'Master Arun Verma', craftType: 'Woodwork', level: 'intermediate', duration: 150, lessons: 10, thumbnail: '', status: 'active' },
  ]);

  // Achievement management states
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', name: 'First Sale', description: 'Complete your first sale', icon: '🎉', category: 'Sales', pointsRequired: 0 },
    { id: '2', name: 'Quality Master', description: 'Get QC approval on 10 products', icon: '✅', category: 'Quality', pointsRequired: 100 },
    { id: '3', name: 'Rising Star', description: 'Reach 50 sales', icon: '⭐', category: 'Sales', pointsRequired: 500 },
    { id: '4', name: 'Customer Favorite', description: 'Get 50+ 5-star reviews', icon: '❤️', category: 'Reviews', pointsRequired: 300 },
    { id: '5', name: 'Academy Graduate', description: 'Complete 5 courses', icon: '🎓', category: 'Learning', pointsRequired: 200 },
    { id: '6', name: 'Top Seller', description: 'Reach ₹1,00,000 in sales', icon: '💰', category: 'Sales', pointsRequired: 1000 },
  ]);

  // Category management states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Pottery', description: 'Clay and ceramic items', icon: '🏺', productsCount: 45 },
    { id: '2', name: 'Textile', description: 'Fabrics and woven items', icon: '🧵', productsCount: 67 },
    { id: '3', name: 'Jewelry', description: 'Handcrafted ornaments', icon: '💍', productsCount: 89 },
    { id: '4', name: 'Woodwork', description: 'Carved wooden items', icon: '🪵', productsCount: 34 },
    { id: '5', name: 'Metalwork', description: 'Metal crafts', icon: '⚒️', productsCount: 28 },
    { id: '6', name: 'Painting', description: 'Traditional art', icon: '🎨', productsCount: 52 },
  ]);

  // User management states
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<'artisan' | 'buyer' | 'coordinator' | 'admin'>('buyer');

  // Coupon management states
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    validFrom: '',
    validUntil: '',
    description: ''
  });
  
  // Mock users data (in production, this would come from backend)
  const [users, setUsers] = useState([
    { id: 'user-artisan-1', name: 'Rajesh Kumar', email: 'rajesh@kalamitra.com', role: 'artisan', region: 'Jaipur', language: 'en' },
    { id: 'user-buyer-1', name: 'Anjali Mehta', email: 'anjali@kalamitra.com', role: 'buyer', region: 'Mumbai', language: 'en' },
    { id: 'user-coordinator-1', name: 'QC Coordinator', email: 'coordinator@kalamitra.com', role: 'coordinator', region: 'Delhi', language: 'en' },
    { id: 'user-admin-1', name: 'Super Admin', email: 'admin@kalamitra.com', role: 'admin', region: 'New Delhi', language: 'en' },
  ]);

  const stats = {
    totalUsers: users.length,
    artisans: users.filter(u => u.role === 'artisan').length,
    buyers: users.filter(u => u.role === 'buyer').length,
    coordinators: users.filter(u => u.role === 'coordinator').length,
    totalProducts: state.products.length,
    pendingQC: state.products.filter(p => !p.hasQualityBadge).length,
    totalOrders: state.orders.length,
    completedOrders: state.orders.filter(o => o.status === 'completed').length,
  };

  const handleAddBenefit = () => {
    setNewScheme({
      ...newScheme,
      benefits: [...(newScheme.benefits || []), ''],
    });
  };

  const handleAddEligibility = () => {
    setNewScheme({
      ...newScheme,
      eligibility: [...(newScheme.eligibility || []), ''],
    });
  };

  const handleSaveScheme = () => {
    // In production, this would call an API
    console.log('Saving new scheme:', newScheme);
    alert('Government Scheme Added Successfully!\n\nThis would be saved to the database in production.');
    setShowAddScheme(false);
    setNewScheme({
      name: '',
      ministry: '',
      description: '',
      benefits: [''],
      eligibility: [''],
      applicationLink: '',
      category: 'finance',
      status: 'active',
    });
  };

  // User Management Handlers
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      // In production, call API
      alert(`User ${userId} deleted successfully!`);
      // dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  // Course Management Handlers
  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Course deleted successfully!');
    }
  };

  const handleToggleCourseStatus = (courseId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId 
        ? { ...c, status: c.status === 'active' ? 'archived' : 'active' as 'active' | 'draft' | 'archived' }
        : c
    ));
    alert('Course status updated!');
  };

  // Achievement Management Handlers
  const handleDeleteAchievement = (achievementId: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(a => a.id !== achievementId));
      alert('Achievement deleted successfully!');
    }
  };

  // Category Management Handlers
  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
      alert('Category deleted successfully!');
    }
  };

  // Product Moderation Handlers
  const handleApproveProduct = async (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    if (product) {
      dispatch({ 
        type: 'UPDATE_PRODUCT', 
        payload: {
          id: productId,
          updates: {
            hasQualityBadge: true,
            isActive: true,
          }
        }
      });
      alert('✅ Product approved successfully!\n\nThe product is now live on the marketplace.');
    }
  };

  const handleRejectProduct = async (productId: string) => {
    if (confirm('Are you sure you want to reject this product?')) {
      const product = state.products.find(p => p.id === productId);
      if (product) {
        dispatch({ 
          type: 'UPDATE_PRODUCT', 
          payload: {
            id: productId,
            updates: {
              hasQualityBadge: false,
              isActive: false,
            }
          }
        });
        alert('❌ Product rejected!\n\nThe artisan will be notified.');
      }
    }
  };

  // Report Handling
  const handleDismissReport = (reportId: string) => {
    if (confirm('Dismiss this report?')) {
      alert('Report dismissed!');
      // In production: dispatch({ type: 'DISMISS_REPORT', payload: reportId });
    }
  };

  const handleRemoveReportedContent = (reportId: string) => {
    if (confirm('Are you sure you want to remove this content?')) {
      alert('Content removed successfully!');
      // In production: dispatch({ type: 'REMOVE_CONTENT', payload: reportId });
    }
  };

  // User Role Management Handlers
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewRole(user.role);
    setShowEditUser(true);
  };

  const handleSaveUserRole = () => {
    if (editingUser) {
      alert(
        `✅ User Role Updated!\n\n` +
        `User: ${editingUser.name}\n` +
        `Old Role: ${editingUser.role}\n` +
        `New Role: ${newRole}\n\n` +
        `In production, this would update the database.`
      );
      setShowEditUser(false);
      setEditingUser(null);
    }
  };

  // Quick Actions Handlers
  const handleManageUserRoles = () => {
    // Navigate to User Management tab
    setActiveTab('users');
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stats: {
        totalUsers: users.length,
        totalProducts: state.products.length,
        totalOrders: state.orders.length,
        totalRevenue: state.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0),
      },
      users: users,
      products: state.products,
      orders: state.orders,
    };

    // Convert to JSON
    const dataStr = JSON.stringify(data, null, 2);
    
    // Create download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kalamitra-platform-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(
      `✅ Platform Data Exported!\n\n` +
      `File: kalamitra-platform-data-${new Date().toISOString().split('T')[0]}.json\n\n` +
      `Exported:\n` +
      `- ${state.users?.length || 0} users\n` +
      `- ${state.products.length} products\n` +
      `- ${state.orders.length} orders\n` +
      `- Platform statistics\n\n` +
      `Check your Downloads folder!`
    );
  };

  const handleGenerateReports = () => {
    const reports = {
      salesReport: {
        totalOrders: state.orders.length,
        completedOrders: state.orders.filter(o => o.status === 'completed').length,
        totalRevenue: state.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0),
        averageOrderValue: state.orders.length > 0 
          ? state.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0) / state.orders.filter(o => o.status === 'completed').length 
          : 0,
      },
      userReport: {
        totalUsers: users.length,
        artisans: users.filter((u: any) => u.role === 'artisan').length,
        buyers: users.filter((u: any) => u.role === 'buyer').length,
        coordinators: users.filter((u: any) => u.role === 'coordinator').length,
      },
      productReport: {
        totalProducts: state.products.length,
        activeProducts: state.products.filter(p => p.isActive).length,
        qcVerified: state.products.filter(p => p.hasQualityBadge).length,
        pendingQC: state.products.filter(p => !p.hasQualityBadge && !p.isActive).length,
      },
    };

    alert(
      `📊 Platform Reports\n\n` +
      `═══ SALES REPORT ═══\n` +
      `Total Orders: ${reports.salesReport.totalOrders}\n` +
      `Completed: ${reports.salesReport.completedOrders}\n` +
      `Revenue: ₹${reports.salesReport.totalRevenue.toLocaleString('en-IN')}\n` +
      `Avg Order Value: ₹${Math.round(reports.salesReport.averageOrderValue).toLocaleString('en-IN')}\n\n` +
      `═══ USER REPORT ═══\n` +
      `Total Users: ${reports.userReport.totalUsers}\n` +
      `Artisans: ${reports.userReport.artisans}\n` +
      `Buyers: ${reports.userReport.buyers}\n` +
      `Coordinators: ${reports.userReport.coordinators}\n\n` +
      `═══ PRODUCT REPORT ═══\n` +
      `Total Products: ${reports.productReport.totalProducts}\n` +
      `Active: ${reports.productReport.activeProducts}\n` +
      `QC Verified: ${reports.productReport.qcVerified}\n` +
      `Pending QC: ${reports.productReport.pendingQC}\n\n` +
      `Go to "Platform Analytics" tab for detailed charts.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield size={32} />
          Admin Control Panel
        </h1>
        <p className="text-indigo-50">Complete platform management and configuration</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-600" size={24} />
            <span className="font-semibold">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.artisans} artisans, {stats.buyers} buyers, {stats.coordinators} coordinators
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-purple-600" size={24} />
            <span className="font-semibold">Products</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.pendingQC} pending QC approval</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-green-600" size={24} />
            <span className="font-semibold">Orders</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.completedOrders} completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-orange-600" size={24} />
            <span className="font-semibold">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">₹{state.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">Total platform revenue</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'schemes'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Manage Schemes
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'courses'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BookOpen size={16} className="inline mr-2" />
          Courses
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Award size={16} className="inline mr-2" />
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Tag size={16} className="inline mr-2" />
          Categories
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <AlertCircle size={16} className="inline mr-2" />
          Moderation
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Platform Analytics
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'coupons'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Gift size={16} className="inline mr-2" />
          Coupons
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={24} className="text-blue-600" />
                Recent User Registrations
              </h3>
              <div className="space-y-3">
                {users.slice(-5).reverse().map((user: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'artisan' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'buyer' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings size={24} className="text-purple-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Government Scheme
                </button>
                <button 
                  onClick={handleManageUserRoles}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  Manage User Roles
                </button>
                <button 
                  onClick={handleExportData}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Export Platform Data
                </button>
                <button 
                  onClick={handleGenerateReports}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 size={20} />
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">User Management</h2>
            <p className="text-purple-50">Manage artisans and coordinators (Buyers are managed separately)</p>
          </div>

          {/* Artisan Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                🎨 Artisan Management
                <span className="text-lg font-normal text-gray-600">
                  ({users.filter((u: any) => u.role === 'artisan').length} artisans)
                </span>
              </h3>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center gap-2">
                <Plus size={18} />
                Add Artisan
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Region</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter((u: any) => u.role === 'artisan').map((user: any) => (
                    <tr key={user.id} className="hover:bg-purple-50">
                      <td className="px-4 py-3 font-semibold">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">{user.region || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {state.products.filter(p => p.artisanId === user.id).length} products
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => alert(`View ${user.name}'s profile and products`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Profile"
                          >
                            <Users size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit Artisan"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Artisan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coordinator Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                ⚖️ Coordinator Management
                <span className="text-lg font-normal text-gray-600">
                  ({users.filter((u: any) => u.role === 'coordinator').length} coordinators)
                </span>
              </h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2">
                <Plus size={18} />
                Add Coordinator
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Region</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">QC Approved</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter((u: any) => u.role === 'coordinator').map((user: any) => (
                    <tr key={user.id} className="hover:bg-green-50">
                      <td className="px-4 py-3 font-semibold">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">{user.region || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {state.products.filter(p => p.hasQualityBadge).length} products
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => alert(`View ${user.name}'s QC activity`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Activity"
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit Coordinator"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Coordinator"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Note */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> Buyers are managed separately through the customer management system. 
              This section is for managing platform contributors (artisans and coordinators) only.
            </p>
          </div>

          {/* Edit User Modal */}
          {showEditUser && editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit User Role</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="text"
                      value={editingUser.email}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Role</label>
                    <input
                      type="text"
                      value={editingUser.role}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                    >
                      <option value="artisan">Artisan</option>
                      <option value="buyer">Buyer</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Changing user roles will affect their access permissions.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowEditUser(false);
                        setEditingUser(null);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUserRole}
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Save Role
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Schemes Tab */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Government Schemes Management</h2>
            <button
              onClick={() => setShowAddScheme(!showAddScheme)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus size={20} />
              Add New Scheme
            </button>
          </div>

          {/* Add Scheme Form */}
          {showAddScheme && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Government Scheme</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Scheme Name *</label>
                    <input
                      type="text"
                      value={newScheme.name}
                      onChange={(e) => setNewScheme({...newScheme, name: e.target.value})}
                      placeholder="e.g., PM Vishwakarma Scheme"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ministry *</label>
                    <input
                      type="text"
                      value={newScheme.ministry}
                      onChange={(e) => setNewScheme({...newScheme, ministry: e.target.value})}
                      placeholder="e.g., Ministry of MSME"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea
                    value={newScheme.description}
                    onChange={(e) => setNewScheme({...newScheme, description: e.target.value})}
                    placeholder="Brief description of the scheme"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      value={newScheme.category}
                      onChange={(e) => setNewScheme({...newScheme, category: e.target.value as any})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                    >
                      <option value="finance">Finance</option>
                      <option value="training">Training</option>
                      <option value="marketing">Marketing</option>
                      <option value="export">Export</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Status *</label>
                    <select
                      value={newScheme.status}
                      onChange={(e) => setNewScheme({...newScheme, status: e.target.value as any})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                    >
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Application Link *</label>
                  <input
                    type="url"
                    value={newScheme.applicationLink}
                    onChange={(e) => setNewScheme({...newScheme, applicationLink: e.target.value})}
                    placeholder="https://scheme.gov.in"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold">Benefits</label>
                    <button
                      onClick={handleAddBenefit}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      + Add Benefit
                    </button>
                  </div>
                  {newScheme.benefits?.map((benefit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...(newScheme.benefits || [])];
                        newBenefits[idx] = e.target.value;
                        setNewScheme({...newScheme, benefits: newBenefits});
                      }}
                      placeholder={`Benefit ${idx + 1}`}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400 mb-2"
                    />
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold">Eligibility Criteria</label>
                    <button
                      onClick={handleAddEligibility}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      + Add Criterion
                    </button>
                  </div>
                  {newScheme.eligibility?.map((criterion, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={criterion}
                      onChange={(e) => {
                        const newEligibility = [...(newScheme.eligibility || [])];
                        newEligibility[idx] = e.target.value;
                        setNewScheme({...newScheme, eligibility: newEligibility});
                      }}
                      placeholder={`Eligibility ${idx + 1}`}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400 mb-2"
                    />
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddScheme(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveScheme}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    Save Scheme
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Schemes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Schemes (Mock Data)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300">
                <div className="flex-1">
                  <h4 className="font-bold">PM Vishwakarma Scheme</h4>
                  <p className="text-sm text-gray-600">Ministry of MSME</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">ACTIVE</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Analytics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Total GMV</p>
              <p className="text-2xl font-bold text-blue-900">₹{state.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Active Products</p>
              <p className="text-2xl font-bold text-purple-900">{state.products.filter(p => p.isActive).length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-900">{state.orders.length > 0 ? ((state.orders.filter(o => o.status === 'completed').length / state.orders.length) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">Course Management</h3>
            <button 
              onClick={() => setShowAddCourse(!showAddCourse)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              {showAddCourse ? 'Cancel' : 'Add New Course'}
            </button>
          </div>

          {/* Add Course Form */}
          {showAddCourse && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Add New Course</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Course Title" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <input type="text" placeholder="Instructor Name" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <select className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input type="number" placeholder="Duration (minutes)" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
              </div>
              <button 
                onClick={() => {
                  alert('Course added successfully!');
                  setShowAddCourse(false);
                }}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Save Course
              </button>
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-indigo-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">By {course.instructor}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {course.level.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === 'active' ? 'bg-green-100 text-green-700' :
                        course.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>⏱️ {course.duration} min</span>
                      <span>📚 {course.lessons} lessons</span>
                      <span>📊 {course.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleCourseStatus(course.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Toggle Status
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">Achievement Management</h3>
            <button 
              onClick={() => setShowAddAchievement(!showAddAchievement)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              {showAddAchievement ? 'Cancel' : 'Add New Achievement'}
            </button>
          </div>

          {/* Add Achievement Form */}
          {showAddAchievement && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Add New Achievement</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Achievement Name" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <input type="text" placeholder="Icon (emoji)" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <textarea placeholder="Description" className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" rows={2}></textarea>
                <select className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400">
                  <option value="Sales">Sales</option>
                  <option value="Quality">Quality</option>
                  <option value="Reviews">Reviews</option>
                  <option value="Learning">Learning</option>
                </select>
                <input type="number" placeholder="Points Required" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
              </div>
              <button 
                onClick={() => {
                  alert('Achievement added successfully!');
                  setShowAddAchievement(false);
                }}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Save Achievement
              </button>
            </div>
          )}

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-indigo-300">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {achievement.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {achievement.pointsRequired} points
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Edit functionality coming soon!')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAchievement(achievement.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">Product Category Management</h3>
            <button 
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              {showAddCategory ? 'Cancel' : 'Add New Category'}
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Category Name" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <input type="text" placeholder="Icon (emoji)" className="px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" />
                <textarea placeholder="Description" className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-indigo-400" rows={2}></textarea>
              </div>
              <button 
                onClick={() => {
                  alert('Category added successfully!');
                  setShowAddCategory(false);
                }}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Save Category
              </button>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-indigo-300">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                    {category.productsCount} products
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Edit functionality coming soon!')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Content Moderation</h3>

          {/* Pending Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-600" />
              Pending Product Reviews
            </h4>
            <div className="space-y-4">
              {state.products.filter(p => !p.isActive && !p.hasQualityBadge).slice(0, 5).length > 0 ? (
                state.products.filter(p => !p.isActive && !p.hasQualityBadge).slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300">
                    <div className="flex items-center gap-4">
                      <img src={product.photos?.[0] || product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <h5 className="font-bold">{product.name}</h5>
                        <p className="text-sm text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">By {product.artisanName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveProduct(product.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectProduct(product.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No pending reviews</p>
              )}
            </div>
          </div>

          {/* Reported Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              Reported Content
            </h4>
            <div className="space-y-4">
              {[
                { id: '1', type: 'Product', name: 'Vintage Clay Pot', reason: 'Misleading description', reporter: 'User #234', date: '2024-01-10' },
                { id: '2', type: 'Review', name: 'Review on Silver Earrings', reason: 'Inappropriate language', reporter: 'User #567', date: '2024-01-09' },
              ].map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-red-300">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">{report.type}</span>
                      <h5 className="font-bold">{report.name}</h5>
                    </div>
                    <p className="text-sm text-gray-600">Reason: {report.reason}</p>
                    <p className="text-xs text-gray-500">Reported by {report.reporter} on {report.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Reviewing report: ${report.name}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => handleRemoveReportedContent(report.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={() => handleDismissReport(report.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">💰 Coupon Management</h2>
            <p className="text-green-50">Create and manage discount coupons for your platform</p>
          </div>

          {/* Add Coupon Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddCoupon(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Coupon
            </button>
          </div>

          {/* Active Coupons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Active Coupons</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Min Purchase</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Valid Until</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Used</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {couponService.getAllActiveCoupons().map((coupon) => (
                    <tr key={coupon.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-green-600">{coupon.code}</td>
                      <td className="px-4 py-3 capitalize">{coupon.type}</td>
                      <td className="px-4 py-3">
                        {coupon.type === 'percentage' 
                          ? `${coupon.value}%` 
                          : `₹${coupon.value}`}
                        {coupon.maxDiscount && (
                          <span className="text-xs text-gray-500"> (max ₹{coupon.maxDiscount})</span>
                        )}
                      </td>
                      <td className="px-4 py-3">₹{coupon.minPurchase || 0}</td>
                      <td className="px-4 py-3">
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              couponService.toggleCouponStatus(coupon.id);
                              alert(`Coupon ${coupon.status === 'active' ? 'disabled' : 'enabled'}!`);
                              window.location.reload();
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xl"
                            title={coupon.status === 'active' ? 'Disable' : 'Enable'}
                          >
                            {coupon.status === 'active' ? '🔒' : '🔓'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon ${coupon.code}?`)) {
                                couponService.deleteCoupon(coupon.id);
                                alert('Coupon deleted!');
                                window.location.reload();
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xl"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-green-100 text-sm">Total Coupons</p>
              <p className="text-3xl font-bold">{couponService.getAllActiveCoupons().length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-blue-100 text-sm">Active Coupons</p>
              <p className="text-3xl font-bold">
                {couponService.getAllActiveCoupons().filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-purple-100 text-sm">Total Usage</p>
              <p className="text-3xl font-bold">
                {couponService.getAllActiveCoupons().reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-orange-100 text-sm">Est. Discount Given</p>
              <p className="text-3xl font-bold">₹12,450</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Coupon</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    placeholder={newCoupon.type === 'percentage' ? '25' : '100'}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Purchase (₹)
                  </label>
                  <input
                    type="number"
                    value={newCoupon.minPurchase}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: Number(e.target.value) })}
                    placeholder="500"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {newCoupon.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                    placeholder="500"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="25% off for summer sale"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong> {newCoupon.code || 'CODE'} - 
                  {newCoupon.type === 'percentage' ? ` ${newCoupon.value}% off` : ` ₹${newCoupon.value} off`}
                  {newCoupon.minPurchase > 0 && ` on orders above ₹${newCoupon.minPurchase}`}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddCoupon(false);
                    setNewCoupon({
                      code: '',
                      type: 'percentage',
                      value: 0,
                      minPurchase: 0,
                      maxDiscount: 0,
                      validFrom: '',
                      validUntil: '',
                      description: ''
                    });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newCoupon.code || !newCoupon.validFrom || !newCoupon.validUntil || !newCoupon.description) {
                      alert('Please fill all required fields!');
                      return;
                    }
                    couponService.createCoupon({
                      ...newCoupon,
                      status: 'active'
                    });
                    alert(`✅ Coupon ${newCoupon.code} created successfully!`);
                    setShowAddCoupon(false);
                    setNewCoupon({
                      code: '',
                      type: 'percentage',
                      value: 0,
                      minPurchase: 0,
                      maxDiscount: 0,
                      validFrom: '',
                      validUntil: '',
                      description: ''
                    });
                    window.location.reload();
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
