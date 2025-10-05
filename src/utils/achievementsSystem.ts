import { User, Product, Order, Review } from '../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'sales' | 'quality' | 'community' | 'learning' | 'milestone';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: string;
    count: number;
  };
}

export interface UserProgress {
  userId: string;
  level: number;
  totalPoints: number;
  achievements: string[]; // Achievement IDs
  nextLevelPoints: number;
  progress: number; // Percentage to next level
}

export const ACHIEVEMENTS: Achievement[] = [
  // Sales Achievements
  {
    id: 'first-sale',
    name: 'First Sale',
    description: 'Complete your first order',
    icon: '🎯',
    category: 'sales',
    points: 10,
    rarity: 'common',
    requirement: { type: 'completed_orders', count: 1 },
  },
  {
    id: 'ten-sales',
    name: 'Rising Star',
    description: 'Complete 10 orders',
    icon: '⭐',
    category: 'sales',
    points: 50,
    rarity: 'rare',
    requirement: { type: 'completed_orders', count: 10 },
  },
  {
    id: 'fifty-sales',
    name: 'Master Seller',
    description: 'Complete 50 orders',
    icon: '💎',
    category: 'sales',
    points: 200,
    rarity: 'epic',
    requirement: { type: 'completed_orders', count: 50 },
  },
  {
    id: 'hundred-sales',
    name: 'Legendary Artisan',
    description: 'Complete 100 orders',
    icon: '👑',
    category: 'sales',
    points: 500,
    rarity: 'legendary',
    requirement: { type: 'completed_orders', count: 100 },
  },

  // Quality Achievements
  {
    id: 'five-star-seller',
    name: '5-Star Seller',
    description: 'Maintain a 5.0 average rating',
    icon: '🌟',
    category: 'quality',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'avg_rating', count: 5 },
  },
  {
    id: 'quality-master',
    name: 'Quality Master',
    description: 'Get 10 products QC verified',
    icon: '🏆',
    category: 'quality',
    points: 75,
    rarity: 'rare',
    requirement: { type: 'qc_verified', count: 10 },
  },
  {
    id: 'customer-favorite',
    name: 'Customer Favorite',
    description: 'Receive 50 5-star reviews',
    icon: '❤️',
    category: 'quality',
    points: 150,
    rarity: 'epic',
    requirement: { type: 'five_star_reviews', count: 50 },
  },

  // Community Achievements
  {
    id: 'helpful-reviewer',
    name: 'Helpful Reviewer',
    description: 'Write 10 helpful reviews',
    icon: '📝',
    category: 'community',
    points: 30,
    rarity: 'common',
    requirement: { type: 'reviews_written', count: 10 },
  },
  {
    id: 'community-helper',
    name: 'Community Helper',
    description: 'Help 50 people with reviews and feedback',
    icon: '🤝',
    category: 'community',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'helpful_actions', count: 50 },
  },

  // Milestone Achievements
  {
    id: 'first-product',
    name: 'Artisan Debut',
    description: 'List your first product',
    icon: '🎨',
    category: 'milestone',
    points: 5,
    rarity: 'common',
    requirement: { type: 'products_listed', count: 1 },
  },
  {
    id: 'hundred-products',
    name: 'Product Master',
    description: 'List 100 products',
    icon: '📦',
    category: 'milestone',
    points: 200,
    rarity: 'epic',
    requirement: { type: 'products_listed', count: 100 },
  },
  {
    id: 'global-reach',
    name: 'Global Reach',
    description: 'Make an international sale',
    icon: '🌍',
    category: 'milestone',
    points: 150,
    rarity: 'epic',
    requirement: { type: 'international_sale', count: 1 },
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'List 10 eco-friendly products',
    icon: '♻️',
    category: 'milestone',
    points: 75,
    rarity: 'rare',
    requirement: { type: 'eco_products', count: 10 },
  },
];

export const calculateUserProgress = (
  user: User,
  products: Product[],
  orders: Order[],
  reviews: Review[]
): UserProgress => {
  // Calculate stats
  const userProducts = products.filter(p => p.artisanId === user.id);
  const userOrders = orders.filter(o => o.artisanId === user.id);
  const completedOrders = userOrders.filter(o => o.status === 'completed');
  const qcVerifiedProducts = userProducts.filter(p => p.hasQualityBadge);
  const userReviews = reviews.filter(r => r.buyerId === user.id);
  
  // Product reviews
  const productReviews = reviews.filter(r =>
    userProducts.some(p => p.id === r.productId)
  );
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;
  const fiveStarReviews = productReviews.filter(r => r.rating === 5);

  // Check which achievements are unlocked
  const unlockedAchievements: string[] = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    let isUnlocked = false;
    
    switch (achievement.requirement.type) {
      case 'completed_orders':
        isUnlocked = completedOrders.length >= achievement.requirement.count;
        break;
      case 'avg_rating':
        isUnlocked = avgRating >= achievement.requirement.count;
        break;
      case 'qc_verified':
        isUnlocked = qcVerifiedProducts.length >= achievement.requirement.count;
        break;
      case 'five_star_reviews':
        isUnlocked = fiveStarReviews.length >= achievement.requirement.count;
        break;
      case 'reviews_written':
        isUnlocked = userReviews.length >= achievement.requirement.count;
        break;
      case 'products_listed':
        isUnlocked = userProducts.length >= achievement.requirement.count;
        break;
      case 'helpful_actions':
        // Calculate helpful votes received
        const helpfulCount = userReviews.reduce((sum, r) => sum + r.helpful, 0);
        isUnlocked = helpfulCount >= achievement.requirement.count;
        break;
      case 'international_sale':
        // For now, assume no international sales
        isUnlocked = false;
        break;
      case 'eco_products':
        // For now, assume no eco products tracked
        isUnlocked = false;
        break;
    }
    
    if (isUnlocked) {
      unlockedAchievements.push(achievement.id);
    }
  });

  // Calculate total points
  const totalPoints = unlockedAchievements.reduce((sum, achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    return sum + (achievement?.points || 0);
  }, 0);

  // Calculate level (every 100 points = 1 level)
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = level * 100;
  const progress = ((totalPoints % 100) / 100) * 100;

  return {
    userId: user.id,
    level,
    totalPoints,
    achievements: unlockedAchievements,
    nextLevelPoints,
    progress,
  };
};

export const getRecentAchievements = (
  userProgress: UserProgress,
  count: number = 3
): Achievement[] => {
  return userProgress.achievements
    .slice(-count)
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter((a): a is Achievement => a !== undefined);
};

export const getNextAchievements = (
  user: User,
  products: Product[],
  orders: Order[],
  reviews: Review[],
  count: number = 3
): { achievement: Achievement; progress: number }[] => {
  const userProgress = calculateUserProgress(user, products, orders, reviews);
  const unlockedIds = new Set(userProgress.achievements);
  
  const nextAchievements = ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id))
    .map(achievement => {
      let currentCount = 0;
      
      // Calculate current progress for this achievement
      const userProducts = products.filter(p => p.artisanId === user.id);
      const userOrders = orders.filter(o => o.artisanId === user.id);
      const completedOrders = userOrders.filter(o => o.status === 'completed');
      
      switch (achievement.requirement.type) {
        case 'completed_orders':
          currentCount = completedOrders.length;
          break;
        case 'products_listed':
          currentCount = userProducts.length;
          break;
        case 'qc_verified':
          currentCount = userProducts.filter(p => p.hasQualityBadge).length;
          break;
        case 'reviews_written':
          currentCount = reviews.filter(r => r.buyerId === user.id).length;
          break;
        default:
          currentCount = 0;
      }
      
      const progress = Math.min((currentCount / achievement.requirement.count) * 100, 99);
      
      return { achievement, progress };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, count);

  return nextAchievements;
};

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'rare':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'epic':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'legendary':
      return 'bg-gold-100 text-gold-700 border-gold-300';
  }
};

export const getCategoryIcon = (category: Achievement['category']): string => {
  switch (category) {
    case 'sales':
      return '💰';
    case 'quality':
      return '✨';
    case 'community':
      return '🤝';
    case 'learning':
      return '📚';
    case 'milestone':
      return '🎯';
  }
};
