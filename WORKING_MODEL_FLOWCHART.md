# 🌍 **KalaMitra - Complete Working Model Flowchart**

## 📊 **System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    KALAMITRA ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

    🎨 ARTISAN          ⚖️ COORDINATOR         🛍️ BUYER
    DASHBOARD          DASHBOARD              MARKETPLACE
         │                   │                      │
         └───────────────────┼──────────────────────┘
                             │
                  ┌──────────▼──────────┐
                  │  BACKEND SERVICE    │
                  │  (Shared Database)  │
                  └──────────┬──────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
        Products         Orders           Reviews
        Messages        Disputes         Wishlist
```

## 🔄 **Complete User Journey Flows**

### **FLOW 1: Product Creation (Voice-First)**
```
Artisan Login → Dashboard → "Add Product"
    ↓
🎤 Voice Input: "Beautiful handcrafted blue pottery vase..."
    ↓
🤖 AI Processing (OpenAI GPT)
    ├─ Story Generation
    ├─ Price Suggestion: ₹1,500
    ├─ Material Detection
    └─ Category Classification
    ↓
Artisan Reviews & Edits
    ├─ Edit name/price
    └─ Add photos
    ↓
"Submit for QC" → Product saved (isActive: false)
    ↓
Goes to Coordinator Queue
```

### **FLOW 2: Quality Control**
```
Coordinator Login → QC Tab (3 pending)
    ↓
View Product → "Verify QC"
    ↓
Complete 5-Point Checklist:
    ☐ Material Quality
    ☐ Craftsmanship  
    ☐ Dimensions
    ☐ Finishing
    ☐ Packaging
    ↓
Upload QC Photos → Add Notes → Approve
    ↓
Product Updated:
    ├─ hasQualityBadge: true
    ├─ isActive: true
    └─ qualityCheck: {data}
    ↓
Product LIVE in Marketplace! ✅
```

### **FLOW 3: Purchase Journey**
```
Buyer Login → Marketplace
    ↓
Browse/Search/Filter Products
    ↓
Click Product → View Details
    ├─ Photos & Story
    ├─ Price & Artisan
    ├─ Reviews ⭐⭐⭐⭐⭐ (4.8/5)
    └─ Quality Badge 🏆
    ↓
"Proceed to Payment" 💳
    ↓
Payment Interface:
    ├─ Delivery Address (required)
    ├─ Payment Method (UPI/Card/NetBanking)
    └─ Order Summary
    ↓
"Pay & Place Order"
    ↓
Order Created & Saved
    ├─ Buyer sees in "My Orders"
    ├─ Artisan sees in "Orders"
    └─ Coordinator sees in "Orders Review"
    ↓
Order Placed Successfully! 🎉
```

### **FLOW 4: Order Lifecycle**
```
PENDING → ACCEPTED → IN_PROGRESS → QUALITY_CHECK 
    → SHIPPED → DELIVERED → COMPLETED → REVIEWED

If Issue:
    → DISPUTED → Coordinator Investigates
        ├─ Full Refund
        ├─ Partial Refund
        ├─ Replacement
        └─ No Action
    → RESOLVED
```

### **FLOW 5: Review System**
```
Order Delivered → "Write Review" Button
    ↓
ReviewForm Opens:
    ├─ Select Stars (1-5) ⭐
    ├─ Write Comment (min 20 chars)
    └─ Add Photos (optional, up to 5)
    ↓
Submit Review
    ↓
Review Published:
    ├─ Appears on Product Page
    ├─ Updates Artisan Rating
    └─ Marked "Verified Purchase" ✓
    ↓
Other Buyers See Review
    └─ Can vote "Helpful" 👍
```

### **FLOW 6: Wishlist**
```
Browse Products → See Heart Icon 🤍
    ↓
Click Heart → Add to Wishlist
    ↓
Heart Icon: 🤍 → ❤️
    ↓
Access "My Wishlist" Page
    ├─ View All Saved Products
    ├─ Remove Items
    └─ Quick Buy
    ↓
Wishlist Persists Across Sessions
```

### **FLOW 7: Messaging**
```
Buyer Views Product → "💬 Message Artisan"
    ↓
Conversation Created/Opened
    ↓
Message Interface:
    ├─ Text Input
    ├─ Photo Attachments
    └─ Product Context
    ↓
Send Message
    ↓
Artisan Receives Notification (💬 1)
    ↓
Artisan Replies
    ↓
Real-Time Conversation Continues
```

## 🎯 **Feature Matrix**

### ✅ **Phase 1 - COMPLETED**
- Voice-based product creation
- AI story & price generation  
- QC system (coordinator managed)
- Buyer marketplace with filters
- Secure payment interface
- Order tracking
- Dispute resolution (4 options)
- Multi-language support (EN/HI)
- PWA capabilities

### ✅ **Phase 2 - COMPLETED**
- Reviews & 5-star ratings
- Wishlist functionality
- Direct messaging
- Enhanced user profiles
- Verified purchase badges
- Helpful votes on reviews

### 🔄 **Phase 3 - PENDING**
- Kala Academy (learning)
- Community forum
- Gamification & badges
- AR product preview
- Wallet system
- Loyalty rewards

### 🌐 **Phase 4 - FUTURE**
- Multi-currency support
- Global shipping APIs
- Auto translation
- Export catalog tools
- International marketplace

### 🔒 **Phase 5 - ADVANCED**
- Blockchain certificates
- Advanced AI analytics
- Microloans
- Sustainability tracking
- Government integrations

## 🔐 **Role-Based Access**

```
ARTISAN:
  ✅ Create products
  ✅ View own orders
  ✅ Update order status
  ✅ Raise disputes
  ❌ Cannot approve own QC
  ❌ Cannot see others' products

BUYER:
  ✅ Browse active products
  ✅ Purchase with payment
  ✅ Track orders
  ✅ Write reviews
  ✅ Add to wishlist
  ✅ Message artisans
  ❌ Cannot see inactive products

COORDINATOR:
  ✅ View ALL products (QC)
  ✅ Approve/reject products
  ✅ View ALL orders
  ✅ Release payments
  ✅ Resolve disputes (4 options)
  ✅ Full platform oversight
```

## 💾 **Data Structure**

```javascript
{
  "users": [
    {
      "id": "user-1",
      "name": "Rajesh Kumar",
      "role": "artisan",
      "bio": "Master potter...",
      "craftSpecialty": ["Pottery"],
      "averageRating": 4.8,
      "reviewCount": 23,
      "wishlist": []
    }
  ],
  "products": [
    {
      "id": "prod-1",
      "name": "Blue Pottery Vase",
      "artisanId": "user-1",
      "price": 1500,
      "story": "AI-generated story...",
      "hasQualityBadge": true,
      "isActive": true
    }
  ],
  "orders": [
    {
      "id": "order-1",
      "productId": "prod-1",
      "buyerId": "user-2",
      "artisanId": "user-1",
      "status": "completed",
      "paymentReleased": true
    }
  ],
  "reviews": [
    {
      "id": "review-1",
      "productId": "prod-1",
      "orderId": "order-1",
      "buyerId": "user-2",
      "rating": 5,
      "comment": "Excellent quality!",
      "verified": true,
      "helpful": 12
    }
  ]
}
```

## 🚀 **Technology Stack**

**Frontend:** React 18 + TypeScript + Tailwind CSS  
**Voice:** Web Speech API (Recognition + Synthesis)  
**AI:** OpenAI GPT-3.5-turbo  
**State:** React Context + useReducer  
**Storage:** localStorage (Demo) → PostgreSQL (Production)  
**PWA:** Service Worker + Manifest  
**Icons:** Lucide React  

---

**🎨 KalaMitra: Voice-First AI Marketplace empowering Indian Artisans!**
