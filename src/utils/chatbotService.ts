// AI Chatbot for Customer Support
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
  }[];
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  status: 'active' | 'resolved' | 'escalated';
  createdAt: string;
  updatedAt: string;
}

// Quick responses for common queries
const QUICK_RESPONSES: Record<string, string> = {
  shipping: "📦 Most orders ship within 3-5 business days. You can track your order in the Orders tab. Standard shipping is free for orders above ₹500!",
  returns: "🔄 We accept returns within 7 days of delivery. Items must be in original condition with tags intact. Visit your Orders page to initiate a return.",
  payment: "💳 We accept UPI, Credit/Debit Cards, Net Banking, and Wallets. All payments are 100% secure with SSL encryption.",
  qc: "✅ Products with QC badge have been verified by our quality control team for authenticity and craftsmanship. Look for the green badge!",
  artisan: "🎨 You can connect with artisans through the messaging system on product pages. They typically respond within 24 hours.",
  price: "💰 Our prices are set by artisans and reflect the authentic handmade craftsmanship. You can use coupon codes for additional discounts!",
  quality: "⭐ All our products are handcrafted by skilled artisans. Quality may vary slightly due to the handmade nature, making each piece unique!",
  delivery: "🚚 Delivery times vary by location: Metro cities (3-5 days), Tier-2 cities (5-7 days), Remote areas (7-10 days).",
  discount: "🎁 Check the Offers section for current discounts! First-time buyers get 10% off with code WELCOME10. Subscribe to our newsletter for exclusive deals.",
  wholesale: "📦 For bulk orders (50+ items), please submit a Bulk Inquiry from the product page. Our coordinators will connect you with artisans for special pricing.",
  custom: "🎨 Many artisans accept custom orders! Contact them directly through the product page messaging system to discuss your requirements.",
  cancel: "❌ You can cancel orders within 2 hours of placement without any charges. Visit your Orders page and click 'Cancel Order'."
};

const SUGGESTED_TOPICS = [
  { label: "📦 Track my order", action: "track_order" },
  { label: "💳 Payment methods", action: "payment" },
  { label: "🔄 Returns policy", action: "returns" },
  { label: "✅ QC badge info", action: "qc" },
  { label: "🎁 Discounts & offers", action: "discount" }
];

export class ChatbotService {
  private sessions: Map<string, ChatSession> = new Map();

  async sendMessage(userId: string, message: string): Promise<ChatMessage> {
    const session = this.getOrCreateSession(userId);

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    session.messages.push(userMsg);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate AI response
    const response = await this.generateResponse(message);

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      suggestedActions: response.suggestions
    };
    session.messages.push(assistantMsg);
    session.updatedAt = new Date().toISOString();

    return assistantMsg;
  }

  private async generateResponse(message: string): Promise<{
    content: string;
    suggestions?: { label: string; action: string }[];
  }> {
    const lowerMsg = message.toLowerCase();

    // Try Google AI first
    try {
      const { googleAIService } = await import('./googleAIService');
      const response = await googleAIService.generateText(`You are KalaMitra AI assistant, an expert in Indian handcrafted products and artisan marketplace. Respond helpfully to: ${message}`);
      return {
        content: response,
        suggestions: SUGGESTED_TOPICS
      };
    } catch (error) {
      console.log('Google AI unavailable, using fallback responses');
    }

    // Fallback to quick responses
    for (const [key, response] of Object.entries(QUICK_RESPONSES)) {
      if (lowerMsg.includes(key)) {
        return {
          content: response,
          suggestions: this.getRelatedSuggestions(key)
        };
      }
    }

    // Check for greetings
    if (lowerMsg.match(/^(hi|hello|hey|namaste|good\s+(morning|afternoon|evening))/)) {
      return {
        content: "👋 Namaste! Welcome to KalaMitra! I'm here to help you discover authentic handcrafted products from talented Indian artisans. How can I assist you today?",
        suggestions: SUGGESTED_TOPICS
      };
    }

    // Check for thanks
    if (lowerMsg.match(/(thank|thanks|appreciate)/)) {
      return {
        content: "🙏 You're welcome! Happy to help! Is there anything else you'd like to know about KalaMitra or our products?",
        suggestions: SUGGESTED_TOPICS
      };
    }

    // Default response
    return {
      content: "Thank you for your question! I'm here to help with any queries about our handcrafted products, orders, shipping, or artisan connections. Could you please provide more details about what you're looking for?",
      suggestions: SUGGESTED_TOPICS
    };
  }

  private getRelatedSuggestions(topic: string): { label: string; action: string }[] {
    const relatedTopics: Record<string, { label: string; action: string }[]> = {
      shipping: [
        { label: "🔄 Returns policy", action: "returns" },
        { label: "🚚 Delivery times", action: "delivery" }
      ],
      payment: [
        { label: "🎁 Discounts & offers", action: "discount" },
        { label: "❌ Cancel order", action: "cancel" }
      ],
      returns: [
        { label: "📦 Track order", action: "track_order" },
        { label: "📦 Shipping info", action: "shipping" }
      ]
    };

    return relatedTopics[topic] || SUGGESTED_TOPICS;
  }

  private getOrCreateSession(userId: string): ChatSession {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        id: `session-${userId}-${Date.now()}`,
        userId,
        messages: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    return this.sessions.get(userId)!;
  }

  getSession(userId: string): ChatSession | undefined {
    return this.sessions.get(userId);
  }

  endSession(userId: string): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.status = 'resolved';
      session.updatedAt = new Date().toISOString();
    }
  }
}

export const chatbotService = new ChatbotService();
