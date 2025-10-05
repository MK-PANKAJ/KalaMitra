interface RateLimitConfig {
  maxRequests: number;      // Maximum requests allowed
  timeWindow: number;       // Time window in milliseconds
  cooldown?: number;        // Optional cooldown period in milliseconds
}

interface RateLimitInfo {
  timestamp: number;
  count: number;
  lastReset: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitInfo> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      ...config,
      maxRequests: config.maxRequests ?? 50,        // Default: 50 requests
      timeWindow: config.timeWindow ?? 60 * 1000,   // Default: 1 minute
      cooldown: config.cooldown ?? 5 * 1000         // Default: 5 seconds cooldown
    };
  }

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const info = this.limits.get(key) || { timestamp: now, count: 0, lastReset: now };

    // Check if we need to reset the counter
    if (now - info.timestamp >= this.config.timeWindow) {
      info.count = 0;
      info.timestamp = now;
      info.lastReset = now;
    }

    // Check if we're in cooldown
    if (this.config.cooldown && info.count >= this.config.maxRequests) {
      const cooldownEnd = info.lastReset + this.config.cooldown;
      if (now < cooldownEnd) {
        const remainingCooldown = Math.ceil((cooldownEnd - now) / 1000);
        throw new Error(`Rate limit exceeded. Please wait ${remainingCooldown} seconds.`);
      }
      // Reset after cooldown
      info.count = 0;
      info.lastReset = now;
    }

    // Check if we've hit the limit
    if (info.count >= this.config.maxRequests) {
      const resetTime = Math.ceil((info.timestamp + this.config.timeWindow - now) / 1000);
      throw new Error(`Rate limit exceeded. Resets in ${resetTime} seconds.`);
    }

    // Increment counter and update timestamp
    info.count++;
    this.limits.set(key, info);
    
    return true;
  }

  getRemainingRequests(key: string): number {
    const info = this.limits.get(key);
    if (!info) return this.config.maxRequests;
    
    const now = Date.now();
    if (now - info.timestamp >= this.config.timeWindow) {
      return this.config.maxRequests;
    }
    
    return Math.max(0, this.config.maxRequests - info.count);
  }

  getResetTime(key: string): number {
    const info = this.limits.get(key);
    if (!info) return 0;
    
    const now = Date.now();
    return Math.max(0, info.timestamp + this.config.timeWindow - now);
  }
}

// Create rate limiters with different configurations for different API endpoints
export const rateLimiter = {
  story: new RateLimiter({
    maxRequests: 10,         // 10 story generations
    timeWindow: 60 * 1000,   // per minute
    cooldown: 30 * 1000      // 30 second cooldown if limit hit
  }),
  
  sentiment: new RateLimiter({
    maxRequests: 30,         // 30 sentiment analyses
    timeWindow: 60 * 1000,   // per minute
    cooldown: 10 * 1000      // 10 second cooldown if limit hit
  }),
  
  moderation: new RateLimiter({
    maxRequests: 50,         // 50 content moderations
    timeWindow: 60 * 1000,   // per minute
    cooldown: 5 * 1000       // 5 second cooldown if limit hit
  }),
  
  description: new RateLimiter({
    maxRequests: 20,         // 20 description generations
    timeWindow: 60 * 1000,   // per minute
    cooldown: 15 * 1000      // 15 second cooldown if limit hit
  })
};