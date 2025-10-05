import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Package, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Analytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    conversionRate: number;
  };
  products: {
    total: number;
    active: number;
    avgRating: number;
    topSeller: string;
  };
  customers: {
    total: number;
    returning: number;
    newThisMonth: number;
    retentionRate: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const { state } = useApp();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate analytics
  const calculateAnalytics = (): Analytics => {
    const artisanOrders = state.orders.filter(o => o.artisanId === state.user?.id);
    const completedOrders = artisanOrders.filter(o => o.status === 'completed');
    const artisanProducts = state.products.filter(p => p.artisanId === state.user?.id);
    const activeProducts = artisanProducts.filter(p => p.isActive);
    
    // Revenue calculations
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const thisMonthRevenue = completedOrders
      .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, o) => sum + o.totalPrice, 0);
    
    // Product reviews
    const productReviews = state.reviews.filter(r =>
      artisanProducts.some(p => p.id === r.productId)
    );
    const avgRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 0;

    // Customer data
    const uniqueBuyers = new Set(artisanOrders.map(o => o.buyerId));

    return {
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: totalRevenue - thisMonthRevenue,
        growth: totalRevenue > 0 ? ((thisMonthRevenue / (totalRevenue - thisMonthRevenue)) * 100) : 0,
      },
      orders: {
        total: artisanOrders.length,
        completed: completedOrders.length,
        pending: artisanOrders.length - completedOrders.length,
        conversionRate: artisanOrders.length > 0 ? (completedOrders.length / artisanOrders.length) * 100 : 0,
      },
      products: {
        total: artisanProducts.length,
        active: activeProducts.length,
        avgRating,
        topSeller: artisanProducts[0]?.name || 'N/A',
      },
      customers: {
        total: uniqueBuyers.size,
        returning: 0, // Calculate repeat buyers
        newThisMonth: Math.floor(uniqueBuyers.size * 0.3),
        retentionRate: 65, // Mock retention rate
      },
    };
  };

  const analytics = calculateAnalytics();

  // Mock chart data
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 },
  ];

  const categoryData = [
    { category: 'Pottery', percentage: 35, value: 45000 },
    { category: 'Textiles', percentage: 28, value: 36000 },
    { category: 'Jewelry', percentage: 22, value: 28000 },
    { category: 'Other', percentage: 15, value: 19000 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 size={32} />
          Advanced Analytics
        </h1>
        <p className="text-green-50">Insights to grow your craft business</p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Time Period</h3>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tf === '7d' && 'Last 7 Days'}
                {tf === '30d' && 'Last 30 Days'}
                {tf === '90d' && 'Last 90 Days'}
                {tf === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-600" size={32} />
            {analytics.revenue.growth > 0 && (
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                <TrendingUp size={16} />
                +{analytics.revenue.growth.toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{analytics.revenue.total.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xs text-gray-500 mt-2">
            ₹{analytics.revenue.thisMonth.toLocaleString('en-IN')} this month
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-600" size={32} />
            <span className="text-blue-600 text-sm font-semibold">
              {analytics.orders.conversionRate.toFixed(0)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{analytics.orders.completed}</p>
          <p className="text-sm text-gray-600">Completed Orders</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.orders.pending} pending
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-purple-600" size={32} />
            <span className="text-purple-600 text-sm font-semibold">
              {analytics.products.avgRating.toFixed(1)} ⭐
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{analytics.products.active}</p>
          <p className="text-sm text-gray-600">Active Products</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.products.total} total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-orange-600" size={32} />
            <span className="text-orange-600 text-sm font-semibold">
              {analytics.customers.retentionRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{analytics.customers.total}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.customers.newThisMonth} new this month
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-green-600" />
          Revenue Trend
        </h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {revenueData.map((data, index) => {
            const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
            const height = (data.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full group">
                  <div
                    className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:from-green-700 hover:to-green-500"
                    style={{ height: `${height * 2}px` }}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ₹{data.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-sm text-gray-600 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={24} className="text-purple-600" />
            Sales by Category
          </h3>
          <div className="space-y-4">
            {categoryData.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{cat.category}</span>
                  <span className="text-sm text-gray-600">₹{cat.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{cat.percentage}% of total</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={24} className="text-blue-600" />
            Top Performing Products
          </h3>
          <div className="space-y-3">
            {state.products
              .filter(p => p.artisanId === state.user?.id && p.isActive)
              .slice(0, 5)
              .map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.hasQualityBadge && <p className="text-xs text-green-600">✓ QC</p>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Export Analytics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Export Analytics Report</h3>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
            Download PDF Report
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Export to Excel
          </button>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
            Email Report
          </button>
        </div>
      </div>
    </div>
  );
};
