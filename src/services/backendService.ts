import { User, Product, Order, Dispute } from '../types';

// Mock database - In production, this would be a real backend API
interface Database {
  users: Array<User & { email: string; password: string }>;
  products: Product[];
  orders: Order[];
  disputes: Dispute[];
}

class BackendService {
  private db: Database;
  private readonly STORAGE_KEY = 'kalamitra_backend_db';

  constructor() {
    this.db = this.loadFromStorage();
  }

  private loadFromStorage(): Database {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load backend database:', error);
      }
    }

    // Initialize with demo users
    return {
      users: [
        {
          id: 'user-artisan-1',
          name: 'Rajesh Kumar',
          email: 'rajesh@kalamitra.com',
          password: 'artisan123', // In production, this would be hashed
          role: 'artisan',
          language: 'en',
          region: 'Jaipur, Rajasthan',
        },
        {
          id: 'user-buyer-1',
          name: 'Anjali Mehta',
          email: 'anjali@kalamitra.com',
          password: 'buyer123',
          role: 'buyer',
          language: 'en',
          region: 'Mumbai, Maharashtra',
          wishlist: [],
        },
        {
          id: 'user-coordinator-1',
          name: 'QC Coordinator',
          email: 'coordinator@kalamitra.com',
          password: 'coordinator123',
          role: 'coordinator',
          language: 'en',
          region: 'Delhi',
        },
        {
          id: 'user-admin-1',
          name: 'Super Admin',
          email: 'admin@kalamitra.com',
          password: 'admin123',
          role: 'admin',
          language: 'en',
          region: 'New Delhi',
        },
      ],
      products: [],
      orders: [],
      disputes: [],
    };
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.db));
  }

  // Authentication
  async login(email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.db.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: 'artisan' | 'buyer' | 'coordinator' | 'admin',
    region?: string
  ): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Prevent coordinator self-registration - only admins can create coordinator accounts
    if (role === 'coordinator') {
      throw new Error('Coordinator accounts can only be created by administrators');
    }

    // Check if email already exists
    if (this.db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const newUser: User & { email: string; password: string } = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In production, this would be hashed
      role,
      language: 'en',
      region: region || 'India',
    };

    this.db.users.push(newUser);
    this.saveToStorage();

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Admin-only method to create coordinator accounts
  async createCoordinator(
    name: string,
    email: string,
    password: string,
    region?: string
  ): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    if (this.db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const newCoordinator: User & { email: string; password: string } = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In production, this would be hashed
      role: 'coordinator',
      language: 'en',
      region: region || 'India',
    };

    this.db.users.push(newCoordinator);
    this.saveToStorage();

    const { password: _, ...userWithoutPassword } = newCoordinator;
    return userWithoutPassword;
  }

  // Products - Only artisan can add/edit their own products
  async getProducts(userId?: string, role?: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (role === 'artisan' && userId) {
      // Artisans see only their products (both active and inactive)
      return this.db.products.filter(p => p.artisanId === userId);
    }

    if (role === 'coordinator') {
      // Coordinators see ALL products (for QC review)
      return this.db.products;
    }

    // Buyers see only active products
    return this.db.products.filter(p => p.isActive);
  }

  async addProduct(product: Product): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 300));

    this.db.products.push(product);
    this.saveToStorage();
    return product;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.db.products.findIndex(p => p.id === productId);
    if (index === -1) return null;

    this.db.products[index] = { ...this.db.products[index], ...updates };
    this.saveToStorage();
    return this.db.products[index];
  }

  async deleteProduct(productId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.db.products.findIndex(p => p.id === productId);
    if (index === -1) return false;

    this.db.products.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Orders - Linked between buyers and artisans
  async getOrders(userId: string, role: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (role === 'artisan') {
      // Artisans see orders for their products
      return this.db.orders.filter(o => o.artisanId === userId);
    } else if (role === 'buyer') {
      // Buyers see their own orders
      return this.db.orders.filter(o => o.buyerId === userId);
    } else if (role === 'coordinator') {
      // Coordinators see all orders
      return this.db.orders;
    }

    return [];
  }

  async addOrder(order: Order): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 300));

    this.db.orders.push(order);
    this.saveToStorage();
    return order;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.db.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    this.db.orders[index] = { ...this.db.orders[index], ...updates };
    this.saveToStorage();
    return this.db.orders[index];
  }

  // Disputes - Coordinators can see all, others see their related disputes
  async getDisputes(userId: string, role: string): Promise<Dispute[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (role === 'coordinator') {
      return this.db.disputes;
    }

    // Users see disputes they're involved in
    return this.db.disputes.filter(
      d => d.raisedBy === userId || d.order.artisanId === userId || d.order.buyerId === userId
    );
  }

  async addDispute(dispute: Dispute): Promise<Dispute> {
    await new Promise(resolve => setTimeout(resolve, 300));

    this.db.disputes.push(dispute);
    this.saveToStorage();
    return dispute;
  }

  async updateDispute(disputeId: string, updates: Partial<Dispute>): Promise<Dispute | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.db.disputes.findIndex(d => d.id === disputeId);
    if (index === -1) return null;

    this.db.disputes[index] = { ...this.db.disputes[index], ...updates };
    this.saveToStorage();
    return this.db.disputes[index];
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const user = this.db.users.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // Load initial demo data
  async loadDemoData(): Promise<void> {
    if (this.db.products.length === 0) {
      const { generateDemoData } = await import('../utils/demoData');
      const demoData = generateDemoData();
      
      this.db.products = demoData.products;
      this.db.orders = demoData.orders;
      this.db.disputes = demoData.disputes;
      this.saveToStorage();
    }
  }
}

// Export singleton instance
export const backendService = new BackendService();
