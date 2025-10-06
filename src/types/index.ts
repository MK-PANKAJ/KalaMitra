export type UserRole = 'artisan' | 'buyer' | 'coordinator' | 'admin';

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'redemption' | 'commission';
  amount: number;
  orderId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  upiId?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  language: 'en' | 'hi';
  region?: string;
  rating?: number;
  bio?: string;
  profilePhoto?: string;
  craftSpecialty?: string[];
  yearsOfExperience?: number;
  totalSales?: number;
  averageRating?: number;
  reviewCount?: number;
  wishlist?: string[];
  // Payment & Wallet
  upiId?: string;
  upiVerified?: boolean;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
  };
  wallet?: {
    balance: number;
    pendingAmount: number;
    totalEarnings: number;
    transactions: WalletTransaction[];
  };
}

export interface QualityCheck {
  materialQuality: boolean;
  craftmanship: boolean;
  dimensions: boolean;
  finishing: boolean;
  packaging: boolean;
  photos: string[];
  checkedBy?: string;
  checkedAt?: string;
}

export interface Product {
  id: string;
  artisanId: string;
  artisanName: string;
  name: string;
  description: string;
  story: string;
  category: string;
  region: string;
  voiceRecording?: string;
  photos: string[];
  price: number;
  suggestedPrice?: number;
  materials: string[];
  dimensions?: string;
  qualityCheck?: QualityCheck;
  hasQualityBadge: boolean;
  createdAt: string;
  isActive: boolean;
  // Backwards-compatible / optional fields referenced in UI
  images?: string[];
  craftSpecialty?: string[];
  bio?: string;
  yearsOfExperience?: number;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  // Commission Agreement
  platformCommission?: {
    percentage: number; // e.g., 10 for 10%
    agreedByArtisan: boolean;
    agreedAt: string;
  };
}

export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'quality_check' | 'shipped' | 'delivered' | 'completed' | 'disputed';

export interface OrderMilestone {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  photos?: string[];
}

export interface Order {
  id: string;
  productId: string;
  product: Product;
  buyerId: string;
  buyerName: string;
  artisanId: string;
  artisanName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  milestones: OrderMilestone[];
  // make optional so temporary/demo objects don't fail type checks
  paymentReleased?: boolean;
  items?: { productId: string; quantity: number; price?: number }[];
  createdAt: string;
  deliveryAddress: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  order: Order;
  raisedBy: string;
  raisedByRole: UserRole;
  reason: string;
  description: string;
  photos: string[];
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt?: string;
}

export interface GovernmentScheme {
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
  createdAt: string;
  createdBy?: string;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  orderId?: string;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  helpful: number;
  createdAt: string;
  verified: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface Quotation {
  id: string;
  inquiryId: string;
  artisanId: string;
  artisanName: string;
  buyerId: string;
  
  // Pricing
  pricePerUnit: number;
  totalPrice: number;
  quantity: number;
  
  // Details
  description: string;
  specifications: string;
  materials: string[];
  estimatedDeliveryDays: number;
  
  // Terms
  paymentTerms: string;
  deliveryTerms: string;
  validUntil: string;
  
  // Attachments
  sampleImages?: string[];
  documents?: string[];
  
  // Status
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'negotiating';
  
  // Negotiation
  negotiationHistory?: {
    by: 'buyer' | 'artisan';
    message: string;
    proposedPrice?: number;
    timestamp: string;
  }[];
  
  createdAt: string;
  createdBy?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  productId?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface AppState {
  user: User | null;
  users?: User[];
  products: Product[];
  orders: Order[];
  disputes: Dispute[];
  governmentSchemes: GovernmentScheme[];
  reviews: Review[];
  messages: Message[];
  conversations: Conversation[];
  isListening: boolean;
  isSpeaking: boolean;
  currentLanguage: 'en' | 'hi';
}

export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' }
  | { type: 'CLEAR_DATA' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'ADD_MILESTONE'; payload: { orderId: string; milestone: OrderMilestone } }
  | { type: 'ADD_DISPUTE'; payload: Dispute }
  | { type: 'UPDATE_DISPUTE'; payload: { id: string; updates: Partial<Dispute> } }
  | { type: 'ADD_GOVERNMENT_SCHEME'; payload: GovernmentScheme }
  | { type: 'UPDATE_GOVERNMENT_SCHEME'; payload: { id: string; updates: Partial<GovernmentScheme> } }
  | { type: 'DELETE_GOVERNMENT_SCHEME'; payload: string }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_SPEAKING'; payload: boolean }
  | { type: 'LOAD_DEMO_DATA' };
