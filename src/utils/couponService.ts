// Coupon & Discount System
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userLimit?: number; // Per user usage limit
  status: 'active' | 'expired' | 'disabled';
  description: string;
}

export interface CouponValidation {
  valid: boolean;
  discount: number;
  finalAmount: number;
  message: string;
  coupon?: Coupon;
}

export class CouponService {
  private coupons: Coupon[] = [
    {
      id: 'coup-1',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minPurchase: 500,
      maxDiscount: 200,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      usageLimit: 1000,
      usedCount: 0,
      userLimit: 1,
      status: 'active',
      description: '10% off for first-time buyers (max ₹200)'
    },
    {
      id: 'coup-2',
      code: 'ARTISAN50',
      type: 'fixed',
      value: 50,
      minPurchase: 1000,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      status: 'active',
      usedCount: 0,
      description: '₹50 off on orders above ₹1000'
    },
    {
      id: 'coup-3',
      code: 'POTTERY20',
      type: 'percentage',
      value: 20,
      minPurchase: 800,
      maxDiscount: 400,
      applicableCategories: ['pottery'],
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      status: 'active',
      usedCount: 0,
      description: '20% off on pottery items (max ₹400)'
    },
    {
      id: 'coup-4',
      code: 'FESTIVE100',
      type: 'fixed',
      value: 100,
      minPurchase: 1500,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      status: 'active',
      usedCount: 0,
      description: '₹100 off on orders above ₹1500'
    },
    {
      id: 'coup-5',
      code: 'MEGA25',
      type: 'percentage',
      value: 25,
      minPurchase: 2000,
      maxDiscount: 500,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      usageLimit: 100,
      status: 'active',
      usedCount: 0,
      description: '25% off on orders above ₹2000 (Limited to 100 users)'
    }
  ];

  private userCouponUsage: Map<string, Map<string, number>> = new Map(); // userId -> (couponId -> count)

  validateCoupon(
    code: string, 
    orderAmount: number, 
    userId?: string,
    categories?: string[],
    productIds?: string[]
  ): CouponValidation {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { 
        valid: false, 
        discount: 0, 
        finalAmount: orderAmount,
        message: '❌ Invalid coupon code' 
      };
    }

    // Check if coupon is active
    if (coupon.status !== 'active') {
      return { 
        valid: false, 
        discount: 0, 
        finalAmount: orderAmount,
        message: '❌ This coupon is no longer active' 
      };
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom || now > validUntil) {
      return { 
        valid: false, 
        discount: 0, 
        finalAmount: orderAmount,
        message: '❌ This coupon has expired or is not yet valid' 
      };
    }

    // Check minimum purchase
    if (coupon.minPurchase && orderAmount < coupon.minPurchase) {
      return { 
        valid: false, 
        discount: 0, 
        finalAmount: orderAmount,
        message: `❌ Minimum purchase of ₹${coupon.minPurchase} required (Current: ₹${orderAmount})` 
      };
    }

    // Check overall usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { 
        valid: false, 
        discount: 0, 
        finalAmount: orderAmount,
        message: '❌ Coupon usage limit has been reached' 
      };
    }

    // Check per-user usage limit
    if (userId && coupon.userLimit) {
      const userUsage = this.getUserCouponUsage(userId, coupon.id);
      if (userUsage >= coupon.userLimit) {
        return { 
          valid: false, 
          discount: 0, 
          finalAmount: orderAmount,
          message: '❌ You have already used this coupon the maximum number of times' 
        };
      }
    }

    // Check category restrictions
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      if (!categories || !categories.some(cat => coupon.applicableCategories!.includes(cat))) {
        return { 
          valid: false, 
          discount: 0, 
          finalAmount: orderAmount,
          message: `❌ This coupon is only valid for ${coupon.applicableCategories.join(', ')} products` 
        };
      }
    }

    // Check product restrictions
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      if (!productIds || !productIds.some(id => coupon.applicableProducts!.includes(id))) {
        return { 
          valid: false, 
          discount: 0, 
          finalAmount: orderAmount,
          message: '❌ This coupon is not applicable to the products in your cart' 
        };
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed order amount
    discount = Math.min(discount, orderAmount);
    const finalAmount = orderAmount - discount;

    return {
      valid: true,
      discount: Math.round(discount),
      finalAmount: Math.round(finalAmount),
      message: `✅ Coupon applied! You saved ₹${Math.round(discount)}`,
      coupon
    };
  }

  applyCoupon(code: string, userId?: string): boolean {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return false;

    coupon.usedCount++;

    // Update user-specific usage
    if (userId) {
      this.incrementUserCouponUsage(userId, coupon.id);
    }

    return true;
  }

  private getUserCouponUsage(userId: string, couponId: string): number {
    const userUsage = this.userCouponUsage.get(userId);
    return userUsage?.get(couponId) || 0;
  }

  private incrementUserCouponUsage(userId: string, couponId: string): void {
    if (!this.userCouponUsage.has(userId)) {
      this.userCouponUsage.set(userId, new Map());
    }
    const userUsage = this.userCouponUsage.get(userId)!;
    userUsage.set(couponId, (userUsage.get(couponId) || 0) + 1);
  }

  getAllActiveCoupons(): Coupon[] {
    return this.coupons
      .filter(c => c.status === 'active')
      .sort((a, b) => {
        // Sort by value (percentage coupons first, then by discount value)
        if (a.type === 'percentage' && b.type === 'fixed') return -1;
        if (a.type === 'fixed' && b.type === 'percentage') return 1;
        return b.value - a.value;
      });
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  }

  // Admin functions
  createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      usedCount: 0
    };
    this.coupons.push(newCoupon);
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): boolean {
    const index = this.coupons.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.coupons[index] = { ...this.coupons[index], ...updates };
    return true;
  }

  deleteCoupon(id: string): boolean {
    const index = this.coupons.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.coupons.splice(index, 1);
    return true;
  }

  toggleCouponStatus(id: string): boolean {
    const coupon = this.coupons.find(c => c.id === id);
    if (!coupon) return false;

    coupon.status = coupon.status === 'active' ? 'disabled' : 'active';
    return true;
  }
}

export const couponService = new CouponService();
