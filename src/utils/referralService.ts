// Referral & Rewards System
export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredEmail: string;
  referredId?: string;
  referredName?: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  rewardType: 'credit' | 'coupon' | 'points';
  createdAt: string;
  completedAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  conversionRate: number;
}

export class ReferralService {
  private referrals: Referral[] = [];
  private readonly REWARD_AMOUNT = 100; // ₹100 for each successful referral
  private readonly REFEREE_REWARD = 50; // ₹50 for the referred user

  generateReferralCode(userId: string, userName: string): string {
    // Generate unique code from user name and random string
    const namePrefix = userName.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${namePrefix}${random}`;
  }

  createReferral(referrerId: string, referrerName: string, email: string): Referral {
    const referral: Referral = {
      id: `ref-${Date.now()}`,
      referrerId,
      referrerName,
      referredEmail: email,
      code: this.generateReferralCode(referrerId, referrerName),
      status: 'pending',
      rewardAmount: this.REWARD_AMOUNT,
      rewardType: 'credit',
      createdAt: new Date().toISOString()
    };

    this.referrals.push(referral);
    return referral;
  }

  completeReferral(referralCode: string, referredId: string, referredName: string): {
    success: boolean;
    message: string;
    referrerReward?: number;
    refereeReward?: number;
  } {
    const referral = this.referrals.find(r => r.code === referralCode && r.status === 'pending');
    
    if (!referral) {
      return {
        success: false,
        message: 'Invalid or expired referral code'
      };
    }

    // Update referral
    referral.status = 'completed';
    referral.referredId = referredId;
    referral.referredName = referredName;
    referral.completedAt = new Date().toISOString();

    // Credit rewards (in production, this would update wallet balances)
    console.log(`🎉 Referral completed! 
      - ${referral.referrerName} earned ₹${this.REWARD_AMOUNT}
      - ${referredName} earned ₹${this.REFEREE_REWARD}`);

    return {
      success: true,
      message: `🎉 Referral successful! You earned ₹${this.REFEREE_REWARD} and ${referral.referrerName} earned ₹${this.REWARD_AMOUNT}`,
      referrerReward: this.REWARD_AMOUNT,
      refereeReward: this.REFEREE_REWARD
    };
  }

  validateReferralCode(code: string): { valid: boolean; message: string } {
    const referral = this.referrals.find(r => r.code === code);
    
    if (!referral) {
      return { valid: false, message: 'Invalid referral code' };
    }

    if (referral.status === 'completed') {
      return { valid: false, message: 'This referral code has already been used' };
    }

    if (referral.status === 'expired') {
      return { valid: false, message: 'This referral code has expired' };
    }

    return { valid: true, message: `Valid! You'll get ₹${this.REFEREE_REWARD} credit on signup` };
  }

  getReferralStats(userId: string): ReferralStats {
    const userReferrals = this.referrals.filter(r => r.referrerId === userId);
    const completedReferrals = userReferrals.filter(r => r.status === 'completed');
    const pendingReferrals = userReferrals.filter(r => r.status === 'pending');
    
    return {
      totalReferrals: userReferrals.length,
      completedReferrals: completedReferrals.length,
      pendingReferrals: pendingReferrals.length,
      totalRewards: completedReferrals.reduce((sum, r) => sum + r.rewardAmount, 0),
      conversionRate: userReferrals.length > 0 
        ? (completedReferrals.length / userReferrals.length) * 100 
        : 0
    };
  }

  getUserReferrals(userId: string): Referral[] {
    return this.referrals
      .filter(r => r.referrerId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getShareableLink(code: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?ref=${code}`;
  }

  getShareText(referrerName: string, code: string): string {
    return `🎨 Join me on KalaMitra - India's premier handcrafted marketplace! 

Use my referral code "${code}" and get ₹${this.REFEREE_REWARD} credit on signup! 

✨ Discover authentic handcrafted products from talented artisans
💰 Support local artisans directly
🎁 Exclusive deals and offers

Sign up now: ${this.getShareableLink(code)}

#KalaMitra #Handcrafted #SupportArtisans`;
  }

  // Mock data for demo
  initializeMockData(userId: string, userName: string): void {
    // Create some mock referrals
    this.referrals.push(
      {
        id: 'ref-1',
        referrerId: userId,
        referrerName: userName,
        referredEmail: 'friend1@example.com',
        referredId: 'user-ref-1',
        referredName: 'Priya Sharma',
        code: this.generateReferralCode(userId, userName),
        status: 'completed',
        rewardAmount: this.REWARD_AMOUNT,
        rewardType: 'credit',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ref-2',
        referrerId: userId,
        referrerName: userName,
        referredEmail: 'friend2@example.com',
        code: this.generateReferralCode(userId, userName),
        status: 'pending',
        rewardAmount: this.REWARD_AMOUNT,
        rewardType: 'credit',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    );
  }
}

export const referralService = new ReferralService();
