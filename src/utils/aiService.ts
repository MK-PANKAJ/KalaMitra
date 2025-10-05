// Mock AI service for generating stories and price suggestions
// In production, this would call a real AI API

export interface AIStoryResult {
  story: string;
  suggestedPrice: number;
  materials: string[];
  category: string;
}

const storyTemplates = {
  en: [
    "Crafted with love and dedication in {region}, this exquisite {product} showcases the timeless traditions passed down through generations. Each intricate detail tells the story of skilled artisans who have perfected their craft over years of practice.",
    "Born from the rich cultural heritage of {region}, this beautiful {product} represents the essence of Indian craftsmanship. Made using traditional techniques, it embodies the spirit and soul of our artisan community.",
    "This stunning {product} from {region} is a testament to the incredible skill and patience of our master craftspeople. Every curve and pattern has been carefully created using age-old methods that preserve our cultural legacy.",
  ],
  hi: [
    "{region} से प्यार और समर्पण के साथ तैयार किया गया यह उत्कृष्ट {product} पीढ़ियों से चली आ रही कालातीत परंपराओं को प्रदर्शित करता है। प्रत्येक जटिल विवरण उन कुशल कारीगरों की कहानी बताता है जिन्होंने वर्षों के अभ्यास के दौरान अपनी कला को पूर्ण किया है।",
    "{region} की समृद्ध सांस्कृतिक विरासत से जन्मा यह सुंदर {product} भारतीय शिल्प कौशल के सार का प्रतिनिधित्व करता है। पारंपरिक तकनीकों का उपयोग करके बनाया गया, यह हमारे कारीगर समुदाय की भावना और आत्मा को दर्शाता है।",
    "{region} से यह आश्चर्यजनक {product} हमारे मास्टर शिल्पकारों के अविश्वसनीय कौशल और धैर्य का प्रमाण है। प्रत्येक वक्र और पैटर्न को सावधानीपूर्वक पुरानी विधियों का उपयोग करके बनाया गया है जो हमारी सांस्कृतिक विरासत को संरक्षित करती हैं।",
  ],
};

const categoryKeywords: Record<string, string[]> = {
  pottery: ['clay', 'pot', 'ceramic', 'earthenware', 'मिट्टी', 'बर्तन'],
  textile: ['cloth', 'fabric', 'weaving', 'embroidery', 'कपड़ा', 'बुनाई', 'कढ़ाई'],
  jewelry: ['ornament', 'jewelry', 'necklace', 'earring', 'आभूषण', 'गहना'],
  woodwork: ['wood', 'carving', 'furniture', 'लकड़ी', 'नक्काशी'],
  metalwork: ['metal', 'brass', 'copper', 'bronze', 'धातु', 'पीतल'],
  painting: ['painting', 'art', 'canvas', 'चित्रकला', 'कला'],
  handloom: ['handloom', 'saree', 'dupatta', 'हथकरघा', 'साड़ी'],
};

const materialsByCategory: Record<string, string[]> = {
  pottery: ['Clay', 'Natural pigments', 'Glaze'],
  textile: ['Cotton', 'Silk', 'Natural dyes', 'Thread'],
  jewelry: ['Silver', 'Beads', 'Semi-precious stones'],
  woodwork: ['Teak wood', 'Rosewood', 'Natural polish'],
  metalwork: ['Brass', 'Copper', 'Bronze'],
  painting: ['Natural colors', 'Canvas', 'Gold leaf'],
  handloom: ['Cotton yarn', 'Silk thread', 'Natural dyes'],
  general: ['Natural materials', 'Traditional tools'],
};

// Realistic market-based pricing (in INR) based on Indian handicraft market research
const marketPricing = {
  pottery: {
    small: { min: 150, max: 400 },      // Small items: cups, bowls
    medium: { min: 400, max: 1200 },    // Medium: vases, plates
    large: { min: 1200, max: 3500 },    // Large: sculptures, big pots
  },
  textile: {
    small: { min: 300, max: 800 },      // Small items: handkerchiefs, scarves
    medium: { min: 800, max: 2500 },    // Medium: stoles, cushion covers
    large: { min: 2500, max: 8000 },    // Large: bedspreads, sarees
  },
  jewelry: {
    small: { min: 250, max: 800 },      // Small: earrings, rings
    medium: { min: 800, max: 2500 },    // Medium: bracelets, pendants
    large: { min: 2500, max: 6000 },    // Large: necklaces, sets
  },
  woodwork: {
    small: { min: 200, max: 600 },      // Small: keychains, small boxes
    medium: { min: 600, max: 2000 },    // Medium: photo frames, decorative items
    large: { min: 2000, max: 8000 },    // Large: furniture, sculptures
  },
  metalwork: {
    small: { min: 300, max: 800 },      // Small: diyas, bells
    medium: { min: 800, max: 2500 },    // Medium: plates, bowls
    large: { min: 2500, max: 7000 },    // Large: statues, urns
  },
  painting: {
    small: { min: 500, max: 1500 },     // Small: postcards, small canvases
    medium: { min: 1500, max: 5000 },   // Medium: wall art, portraits
    large: { min: 5000, max: 15000 },   // Large: large canvases, murals
  },
  handloom: {
    small: { min: 400, max: 1200 },     // Small: handkerchiefs, napkins
    medium: { min: 1200, max: 3500 },   // Medium: scarves, stoles
    large: { min: 3500, max: 10000 },   // Large: sarees, dupattas
  },
  general: {
    small: { min: 200, max: 600 },
    medium: { min: 600, max: 2000 },
    large: { min: 2000, max: 5000 },
  },
};

// Size detection keywords
const sizeKeywords = {
  small: ['small', 'mini', 'tiny', 'little', 'छोटा', 'नन्हा', 'cup', 'कप', 'earring', 'ring', 'keychain'],
  medium: ['medium', 'मध्यम', 'vase', 'bowl', 'plate', 'scarf', 'stole', 'bracelet', 'pendant'],
  large: ['large', 'big', 'huge', 'बड़ा', 'saree', 'bedspread', 'furniture', 'sculpture', 'necklace', 'mural'],
};

// Quality/complexity keywords that affect price
const qualityFactors = {
  premium: ['handmade', 'hand-crafted', 'intricate', 'detailed', 'gold', 'silk', 'premium', 'luxury', 'antique'],
  discount: ['simple', 'basic', 'plain', 'सादा'],
};

function detectCategory(description: string): string {
  const lowerDesc = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  return 'general';
}

function detectSize(description: string): 'small' | 'medium' | 'large' {
  const lowerDesc = description.toLowerCase();
  
  // Check for size keywords
  for (const [size, keywords] of Object.entries(sizeKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return size as 'small' | 'medium' | 'large';
    }
  }
  
  // Default based on description length
  const wordCount = description.split(' ').length;
  if (wordCount <= 5) return 'small';
  if (wordCount <= 12) return 'medium';
  return 'large';
}

function detectQualityFactor(description: string): number {
  const lowerDesc = description.toLowerCase();
  
  // Check for premium keywords
  const hasPremium = qualityFactors.premium.some(keyword => lowerDesc.includes(keyword));
  if (hasPremium) return 1.3; // 30% premium
  
  // Check for basic/simple keywords
  const hasDiscount = qualityFactors.discount.some(keyword => lowerDesc.includes(keyword));
  if (hasDiscount) return 0.8; // 20% discount
  
  return 1.0; // Standard pricing
}

function calculatePrice(description: string, category: string): number {
  const size = detectSize(description);
  const qualityFactor = detectQualityFactor(description);
  
  // Get price range for category and size
  const priceRange = marketPricing[category as keyof typeof marketPricing]?.[size] || marketPricing.general[size];
  
  // Calculate base price (70% of range to avoid extremes)
  const basePrice = priceRange.min + ((priceRange.max - priceRange.min) * 0.7);
  
  // Apply quality factor
  const adjustedPrice = basePrice * qualityFactor;
  
  // Round to nearest 50
  return Math.round(adjustedPrice / 50) * 50;
}

// Stop words to remove from product names
const stopWords = [
  'a', 'an', 'the', 'with', 'made', 'of', 'from', 'in', 'for', 'and', 'or',
  'this', 'that', 'these', 'those', 'i', 'am', 'making', 'selling',
  'एक', 'है', 'से', 'के', 'की', 'को', 'में', 'पर', 'यह', 'वह',
];

// Product type keywords (noun)
const productTypes = [
  'pot', 'vase', 'cup', 'bowl', 'plate', 'sculpture', 'statue',
  'saree', 'dupatta', 'scarf', 'stole', 'shawl', 'bedspread',
  'earring', 'necklace', 'bracelet', 'ring', 'pendant', 'jewelry',
  'box', 'frame', 'furniture', 'chair', 'table', 'carving',
  'diya', 'bell', 'urn', 'lamp', 'vessel',
  'painting', 'canvas', 'portrait', 'mural', 'art',
  'बर्तन', 'गहना', 'कपड़ा', 'मूर्ति', 'चित्र',
];

function extractProductName(voiceInput: string): string {
  const input = voiceInput.trim();
  
  // Clean and normalize input
  const words = input.toLowerCase().split(/\s+/);
  
  // Find the main product type (noun)
  let productType = '';
  for (const word of words) {
    if (productTypes.some(type => word.includes(type) || type.includes(word))) {
      productType = word;
      break;
    }
  }
  
  // If product type found, extract name around it
  if (productType) {
    const typeIndex = words.indexOf(productType);
    
    // Get descriptive words before the product type (adjectives)
    const beforeWords = words.slice(Math.max(0, typeIndex - 2), typeIndex)
      .filter(w => !stopWords.includes(w) && w.length > 2);
    
    // Combine: [adjectives] + [product type]
    const nameWords = [...beforeWords, productType];
    
    // Capitalize first letter of each word
    return nameWords
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  
  // Fallback: Remove stop words and take first 2-4 meaningful words
  const meaningfulWords = words
    .filter(w => !stopWords.includes(w) && w.length > 2)
    .slice(0, 4);
  
  if (meaningfulWords.length === 0) {
    // Last resort: just capitalize the input
    return input.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .slice(0, 3)
      .join(' ');
  }
  
  // Capitalize and return
  return meaningfulWords
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateAIStory(
  voiceInput: string,
  region: string,
  language: 'en' | 'hi'
): Promise<AIStoryResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const category = detectCategory(voiceInput);
  const materials = materialsByCategory[category] || materialsByCategory.general;
  const suggestedPrice = calculatePrice(voiceInput, category);

  // Extract product name intelligently
  const productName = extractProductName(voiceInput);

  // Generate story
  const templates = storyTemplates[language];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const story = template
    .replace('{region}', region)
    .replace('{product}', productName);

  return {
    story,
    suggestedPrice,
    materials,
    category,
  };
}

export async function enhanceProductDescription(
  description: string,
  language: 'en' | 'hi'
): Promise<string> {
  // Simulate AI enhancement
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Add more descriptive language
  const enhancements = {
    en: [
      'Beautifully crafted',
      'Meticulously designed',
      'Expertly handmade',
      'Traditionally crafted',
      'Authentically created'
    ],
    hi: [
      'सुंदर रूप से तैयार',
      'सावधानीपूर्वक डिज़ाइन किया गया',
      'विशेषज्ञता से हस्तनिर्मित',
      'पारंपरिक रूप से तैयार',
      'प्रामाणिक रूप से बनाया गया'
    ]
  };
  
  const prefix = enhancements[language][Math.floor(Math.random() * enhancements[language].length)];
  return `${prefix}, ${description}`;
}

export function translateText(text: string, from: 'en' | 'hi', to: 'en' | 'hi'): string {
  // Simple mock translation - in production use a real translation API
  if (from === to) return text;
  
  // This is a placeholder - real implementation would use translation API
  return `[${to.toUpperCase()}] ${text}`;
}

// NEW: AI-powered SEO keywords generation
export async function generateSEOKeywords(productName: string, category: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const baseKeywords = [
    productName.toLowerCase(),
    category,
    'handmade',
    'indian handicraft',
    'artisan made',
    'traditional craft'
  ];
  
  // Add category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    pottery: ['ceramic', 'clay art', 'pottery craft', 'terracotta'],
    textile: ['handwoven', 'fabric art', 'traditional textile', 'handloom'],
    jewelry: ['handcrafted jewelry', 'artisan jewelry', 'ethnic jewelry'],
    woodwork: ['wood carving', 'wooden craft', 'carved wood'],
    metalwork: ['brass craft', 'metal art', 'copper work'],
    painting: ['traditional art', 'folk painting', 'canvas art'],
  };
  
  return [...baseKeywords, ...(categoryKeywords[category] || [])];
}

// NEW: AI-powered product title optimization
export async function optimizeProductTitle(title: string, category: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add category prefix if not present
  if (!title.toLowerCase().includes(category)) {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} - ${title}`;
  }
  
  return title;
}

// NEW: AI-powered bulk quotation analysis
export async function analyzeBulkInquiry(inquiry: {
  productType: string;
  quantity: number;
  description: string;
}): Promise<{
  suggestedArtisans: string[];
  estimatedPrice: { min: number; max: number };
  estimatedDeliveryDays: number;
  complexity: 'low' | 'medium' | 'high';
}> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const category = detectCategory(inquiry.description);
  const size = detectSize(inquiry.description);
  const priceRange = marketPricing[category as keyof typeof marketPricing]?.[size] || marketPricing.general[size];
  
  // Calculate bulk pricing (10-20% discount for bulk)
  const bulkDiscount = inquiry.quantity > 100 ? 0.8 : inquiry.quantity > 50 ? 0.85 : 0.9;
  
  return {
    suggestedArtisans: [], // Would be populated from database
    estimatedPrice: {
      min: Math.round(priceRange.min * bulkDiscount),
      max: Math.round(priceRange.max * bulkDiscount)
    },
    estimatedDeliveryDays: Math.ceil(inquiry.quantity / 10) + 15, // 10 units per day + 15 days buffer
    complexity: inquiry.description.length > 100 ? 'high' : inquiry.description.length > 50 ? 'medium' : 'low'
  };
}

// NEW: AI-powered review sentiment analysis
export async function analyzeReviewSentiment(review: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // 0-1
  keywords: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'beautiful', 'love', 'perfect', 'wonderful'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointed', 'waste', 'broken'];
  
  const lowerReview = review.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerReview.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerReview.includes(word)).length;
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let score = 0.5;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    score = Math.min(0.6 + (positiveCount * 0.1), 1);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = Math.max(0.4 - (negativeCount * 0.1), 0);
  }
  
  return {
    sentiment,
    score,
    keywords: [...positiveWords.filter(w => lowerReview.includes(w)), ...negativeWords.filter(w => lowerReview.includes(w))]
  };
}

// NEW: AI-powered product recommendation
export async function getProductRecommendations(
  userHistory: string[], // product IDs
  currentProduct: string
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock recommendations - in production would use collaborative filtering
  return [];
}

// NEW: AI-powered fraud detection for orders
export async function detectFraudulentOrder(order: {
  buyerId: string;
  totalPrice: number;
  deliveryAddress: string;
}): Promise<{
  isSuspicious: boolean;
  riskScore: number; // 0-1
  reasons: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const reasons: string[] = [];
  let riskScore = 0;
  
  // Check for unusually high price
  if (order.totalPrice > 50000) {
    reasons.push('High order value');
    riskScore += 0.3;
  }
  
  // Check for incomplete address
  if (order.deliveryAddress.length < 20) {
    reasons.push('Incomplete delivery address');
    riskScore += 0.2;
  }
  
  return {
    isSuspicious: riskScore > 0.5,
    riskScore,
    reasons
  };
}

// NEW: AI-powered content moderation
export async function moderateContent(content: string): Promise<{
  isAppropriate: boolean;
  flags: string[];
  confidence: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const inappropriateWords = ['spam', 'scam', 'fake', 'fraud'];
  const flags: string[] = [];
  
  const lowerContent = content.toLowerCase();
  inappropriateWords.forEach(word => {
    if (lowerContent.includes(word)) {
      flags.push(`Contains: ${word}`);
    }
  });
  
  return {
    isAppropriate: flags.length === 0,
    flags,
    confidence: flags.length === 0 ? 0.9 : 0.7
  };
}
