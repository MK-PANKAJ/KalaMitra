// Advanced Analytics & Reporting
import { Order, Product, User, Review } from '../types';

export interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  revenue?: number;
}

export interface AnalyticsDashboard {
  period: string;
  revenue: {
    total: number;
    growth: number;
    byCategory: { category: string; amount: number; percentage: number }[];
    byRegion: { region: string; amount: number }[];
    trend: { date: string; amount: number }[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    returning: number;
    byRole: { role: string; count: number }[];
  };
  products: {
    total: number;
    active: number;
    trending: string[];
    topSelling: { id: string; name: string; sales: number }[];
    lowStock: string[];
  };
  conversion: {
    rate: number;
    funnel: FunnelStep[];
    averageOrderValue: number;
    cartAbandonmentRate: number;
  };
  performance: {
    avgLoadTime: number;
    errorRate: number;
    apiResponseTime: number;
  };
}

export interface KPIMetrics {
  gmv: number; // Gross Merchandise Value
  revenue: number;
  profit: number;
  conversionRate: number;
  averageOrderValue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  churnRate: number;
  nps: number; // Net Promoter Score
}

export class EnhancedAnalyticsService {
  // Conversion Funnel Analysis
  calculateConversionFunnel(orders: Order[], products: Product[]): FunnelStep[] {
    // In production, these would come from actual tracking data
    const totalVisitors = 10000; // Mock: Would use Google Analytics
    const productViews = products.length * 50; // Mock: Based on product views
    const addedToCart = orders.length * 1.5; // Mock: Cart additions
    const initiated = orders.length * 1.2; // Mock: Checkout initiations
    const completed = orders.filter(o => o.status === 'completed').length;

    const steps: FunnelStep[] = [
      {
        step: 'Visitors',
        users: totalVisitors,
        conversionRate: 100,
        dropoffRate: 0
      },
      {
        step: 'Product Views',
        users: productViews,
        conversionRate: (productViews / totalVisitors) * 100,
        dropoffRate: ((totalVisitors - productViews) / totalVisitors) * 100
      },
      {
        step: 'Add to Cart',
        users: Math.round(addedToCart),
        conversionRate: (addedToCart / productViews) * 100,
        dropoffRate: ((productViews - addedToCart) / productViews) * 100
      },
      {
        step: 'Checkout Initiated',
        users: Math.round(initiated),
        conversionRate: (initiated / addedToCart) * 100,
        dropoffRate: ((addedToCart - initiated) / addedToCart) * 100
      },
      {
        step: 'Order Completed',
        users: completed,
        conversionRate: (completed / initiated) * 100,
        dropoffRate: ((initiated - completed) / initiated) * 100,
        revenue: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.totalPrice, 0)
      }
    ];

    return steps;
  }

  // Trending Products Analysis
  getTrendingProducts(orders: Order[], products: Product[], reviews: Review[]): Product[] {
    const productScores = products.map(product => {
      // Calculate score based on multiple factors
      const orderCount = orders.filter(o => 
        o.items.some(item => item.productId === product.id)
      ).length;
      
      const reviewCount = reviews.filter(r => r.productId === product.id).length;
      const avgRating = reviewCount > 0
        ? reviews
            .filter(r => r.productId === product.id)
            .reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
      
      // Recency factor (newer products get boost)
      const daysSinceCreation = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, 30 - daysSinceCreation) / 30;
      
      // Calculate trending score
      const score = (orderCount * 10) + (reviewCount * 5) + (avgRating * 3) + (recencyBoost * 5);
      
      return { product, score };
    });

    return productScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.product);
  }

  // Top Selling Products
  getTopSellingProducts(orders: Order[], products: Product[]): { id: string; name: string; sales: number }[] {
    const salesMap = new Map<string, number>();

    orders.filter(o => o.status === 'completed').forEach(order => {
      order.items.forEach(item => {
        salesMap.set(item.productId, (salesMap.get(item.productId) || 0) + item.quantity);
      });
    });

    return Array.from(salesMap.entries())
      .map(([id, sales]) => {
        const product = products.find(p => p.id === id);
        return { id, name: product?.name || 'Unknown', sales };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }

  // Revenue by Category
  getRevenueByCategory(orders: Order[], products: Product[]): { category: string; amount: number; percentage: number }[] {
    const categoryRevenue = new Map<string, number>();
    let totalRevenue = 0;

    orders.filter(o => o.status === 'completed').forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const revenue = item.price * item.quantity;
          categoryRevenue.set(
            product.category,
            (categoryRevenue.get(product.category) || 0) + revenue
          );
          totalRevenue += revenue;
        }
      });
    });

    return Array.from(categoryRevenue.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalRevenue) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // Revenue by Region
  getRevenueByRegion(orders: Order[]): { region: string; amount: number }[] {
    const regionRevenue = new Map<string, number>();

    orders.filter(o => o.status === 'completed').forEach(order => {
      const region = order.deliveryAddress?.split(',').pop()?.trim() || 'Unknown';
      regionRevenue.set(
        region,
        (regionRevenue.get(region) || 0) + order.totalPrice
      );
    });

    return Array.from(regionRevenue.entries())
      .map(([region, amount]) => ({ region, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  // KPI Calculation
  calculateKPIs(orders: Order[], users: User[], products: Product[]): KPIMetrics {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const platformCommission = 0.1; // 10%
    
    return {
      gmv: totalRevenue,
      revenue: totalRevenue * platformCommission,
      profit: totalRevenue * platformCommission * 0.7, // Assuming 30% operational cost
      conversionRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0,
      averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
      customerAcquisitionCost: 50, // Mock: Would calculate from marketing spend
      customerLifetimeValue: 500, // Mock: Would calculate from historical data
      churnRate: 5, // Mock: Percentage
      nps: 75 // Mock: Net Promoter Score (0-100)
    };
  }

  // User Insights
  getUserInsights(users: User[], orders: Order[]): {
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    usersByRole: { role: string; count: number }[];
    topBuyers: { id: string; name: string; totalSpent: number }[];
    topArtisans: { id: string; name: string; totalSales: number }[];
  } {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    const newUsers = users.filter(u => 
      new Date(u.createdAt).getTime() > thirtyDaysAgo
    ).length;

    const activeUsers = users.filter(u => {
      const userOrders = orders.filter(o => o.buyerId === u.id || o.artisanId === u.id);
      return userOrders.some(o => 
        new Date(o.createdAt).getTime() > sevenDaysAgo
      );
    }).length;

    const returningUsers = users.length - newUsers;

    const usersByRole = [
      { role: 'artisan', count: users.filter(u => u.role === 'artisan').length },
      { role: 'buyer', count: users.filter(u => u.role === 'buyer').length },
      { role: 'coordinator', count: users.filter(u => u.role === 'coordinator').length },
      { role: 'admin', count: users.filter(u => u.role === 'admin').length }
    ];

    // Top buyers
    const buyerSpending = new Map<string, number>();
    orders.filter(o => o.status === 'completed').forEach(order => {
      buyerSpending.set(
        order.buyerId,
        (buyerSpending.get(order.buyerId) || 0) + order.totalPrice
      );
    });

    const topBuyers = Array.from(buyerSpending.entries())
      .map(([id, totalSpent]) => {
        const user = users.find(u => u.id === id);
        return { id, name: user?.name || 'Unknown', totalSpent };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Top artisans
    const artisanSales = new Map<string, number>();
    orders.filter(o => o.status === 'completed').forEach(order => {
      artisanSales.set(
        order.artisanId,
        (artisanSales.get(order.artisanId) || 0) + order.totalPrice
      );
    });

    const topArtisans = Array.from(artisanSales.entries())
      .map(([id, totalSales]) => {
        const user = users.find(u => u.id === id);
        return { id, name: user?.name || 'Unknown', totalSales };
      })
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    return {
      activeUsers,
      newUsers,
      returningUsers,
      usersByRole,
      topBuyers,
      topArtisans
    };
  }

  // Export to CSV
  exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => {
        // Handle strings with commas or quotes
        const stringVal = String(val);
        if (stringVal.includes(',') || stringVal.includes('"')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      }).join(',')
    ).join('\n');
    
    return `${headers}\n${rows}`;
  }

  // Export to JSON
  exportToJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Generate comprehensive report
  generateFullReport(
    orders: Order[], 
    products: Product[], 
    users: User[], 
    reviews: Review[]
  ): AnalyticsDashboard {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      period: `${new Date().toLocaleDateString()}`,
      revenue: {
        total: totalRevenue,
        growth: 15.5, // Mock: Would calculate from historical data
        byCategory: this.getRevenueByCategory(orders, products),
        byRegion: this.getRevenueByRegion(orders),
        trend: [] // Mock: Would populate with time-series data
      },
      users: {
        total: users.length,
        active: this.getUserInsights(users, orders).activeUsers,
        new: this.getUserInsights(users, orders).newUsers,
        returning: this.getUserInsights(users, orders).returningUsers,
        byRole: this.getUserInsights(users, orders).usersByRole
      },
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        trending: this.getTrendingProducts(orders, products, reviews).map(p => p.id),
        topSelling: this.getTopSellingProducts(orders, products),
        lowStock: [] // Mock: Would check inventory
      },
      conversion: {
        rate: this.calculateKPIs(orders, users, products).conversionRate,
        funnel: this.calculateConversionFunnel(orders, products),
        averageOrderValue: this.calculateKPIs(orders, users, products).averageOrderValue,
        cartAbandonmentRate: 35 // Mock: Percentage
      },
      performance: {
        avgLoadTime: 1.2, // Mock: seconds
        errorRate: 0.5, // Mock: percentage
        apiResponseTime: 150 // Mock: milliseconds
      }
    };
  }
}

export const enhancedAnalyticsService = new EnhancedAnalyticsService();
