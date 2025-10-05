# 💰 Wallet & Payment System with UPI Integration

## 🎯 **Overview**

Complete payment system with:
1. **Artisan UPI ID** registration
2. **Platform commission** (predefined cut)
3. **Wallet system** for artisans
4. **Direct payment** to artisan UPI
5. **Payment redemption** from wallet
6. **Transaction history**

---

## 📋 **System Architecture**

### **Payment Flow:**
```
Buyer pays ₹1000 for product
    ↓
Platform holds payment
    ↓
Order completed
    ↓
Platform commission: ₹100 (10%)
Artisan gets: ₹900 (90%)
    ↓
Money added to Artisan Wallet
    ↓
Artisan can redeem to UPI
```

---

## 💳 **Features to Implement**

### **1. Artisan Profile - Add UPI ID**
```typescript
// Add to User interface
interface User {
  // ... existing fields
  upiId?: string;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
  };
  wallet: {
    balance: number;
    pendingAmount: number;
    totalEarnings: number;
    transactions: Transaction[];
  };
}
```

### **2. Platform Commission**
```typescript
interface CommissionConfig {
  productId: string;
  platformCut: number; // percentage (default 10%)
  artisanShare: number; // percentage (default 90%)
  agreedByArtisan: boolean;
  agreedAt: string;
}
```

### **3. Wallet Transaction**
```typescript
interface Transaction {
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
```

---

## 🎨 **Artisan Dashboard - Wallet Section**

### **Wallet Overview:**
```
┌─────────────────────────────────────────┐
│ 💰 My Wallet                            │
├─────────────────────────────────────────┤
│ Available Balance: ₹12,500              │
│ Pending Amount: ₹3,200                  │
│ Total Earnings: ₹45,800                 │
│                                         │
│ [Redeem to UPI]  [View Transactions]   │
└─────────────────────────────────────────┘
```

### **UPI Setup:**
```
┌─────────────────────────────────────────┐
│ 📱 Payment Details                      │
├─────────────────────────────────────────┤
│ UPI ID: rajesh@paytm                    │
│ Status: ✅ Verified                     │
│                                         │
│ [Update UPI ID]                         │
│                                         │
│ Bank Account (Optional):                │
│ Account: XXXX1234                       │
│ IFSC: SBIN0001234                       │
│ Name: Rajesh Kumar                      │
│                                         │
│ [Update Bank Details]                   │
└─────────────────────────────────────────┘
```

### **Redeem Payment Modal:**
```
┌─────────────────────────────────────────┐
│ 💸 Redeem Payment                       │
├─────────────────────────────────────────┤
│ Available Balance: ₹12,500              │
│                                         │
│ Redeem Amount: *                        │
│ [₹12,500]                               │
│                                         │
│ Redeem To:                              │
│ ● UPI ID: rajesh@paytm                  │
│ ○ Bank Account: XXXX1234                │
│                                         │
│ Processing Fee: ₹0 (Free)               │
│ You will receive: ₹12,500               │
│                                         │
│ ⏱️ Estimated time: 1-2 hours            │
│                                         │
│ [Cancel]  [Redeem Now]                  │
└─────────────────────────────────────────┘
```

---

## 📊 **Transaction History**

```
┌─────────────────────────────────────────────────────────┐
│ 📜 Transaction History                                  │
├─────────────────────────────────────────────────────────┤
│ Date       | Type      | Amount    | Status   | Details│
├─────────────────────────────────────────────────────────┤
│ 05-10-2025 | Credit    | +₹900     | ✅ Done  | Order #123│
│            | Commission| -₹100     |          | (10%)   │
│ 04-10-2025 | Redemption| -₹5,000   | ✅ Done  | To UPI  │
│ 03-10-2025 | Credit    | +₹1,350   | ✅ Done  | Order #122│
│            | Commission| -₹150     |          | (10%)   │
│ 02-10-2025 | Credit    | +₹720     | ⏳ Pending| Order #121│
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 **Payment Processing Flow**

### **When Order is Completed:**

**Step 1: Buyer Payment Received**
```
Order Total: ₹1,000
Status: Payment Received
Held by Platform: ₹1,000
```

**Step 2: Order Delivered & Confirmed**
```
Order Status: Completed
Trigger: Payment Release
```

**Step 3: Calculate Commission**
```
Product Price: ₹1,000
Platform Cut: 10% = ₹100
Artisan Share: 90% = ₹900

Commission agreed by artisan: ✅ Yes
Agreement Date: 01-10-2025
```

**Step 4: Credit to Artisan Wallet**
```
Transaction Type: Credit
Amount: +₹900
Description: "Payment for Order #123"
Status: Completed

Wallet Balance Updated:
Previous: ₹11,600
New: ₹12,500
```

**Step 5: Platform Commission**
```
Transaction Type: Commission
Amount: -₹100
Description: "Platform fee (10%)"
Retained by Platform
```

---

## 💸 **Redemption Process**

### **Artisan Initiates Redemption:**

**Step 1: Request**
```
Amount: ₹12,500
Method: UPI (rajesh@paytm)
Processing Fee: ₹0
Net Amount: ₹12,500
```

**Step 2: Verification**
```
✓ UPI ID verified
✓ Sufficient balance
✓ No pending disputes
✓ KYC completed
```

**Step 3: Processing**
```
Status: Processing
Expected Time: 1-2 hours
Transaction ID: TXN123456789
```

**Step 4: Completion**
```
Status: ✅ Completed
Amount Transferred: ₹12,500
To: rajesh@paytm
Date: 05-10-2025 16:45
Reference: TXN123456789

Wallet Balance: ₹0
```

---

## 🎯 **Commission Agreement System**

### **When Artisan Lists Product:**

```
┌─────────────────────────────────────────┐
│ 📋 Platform Commission Agreement        │
├─────────────────────────────────────────┤
│ Product: Blue Pottery Vase              │
│ Your Price: ₹1,000                      │
│                                         │
│ Platform Commission: 10%                │
│ Platform gets: ₹100                     │
│ You receive: ₹900 (90%)                 │
│                                         │
│ ✓ I agree to the platform commission   │
│                                         │
│ Benefits:                               │
│ • Marketing & promotion                 │
│ • Payment security                      │
│ • Quality certification                 │
│ • Customer support                      │
│ • Free wallet & UPI transfer            │
│                                         │
│ [Cancel]  [Agree & List Product]       │
└─────────────────────────────────────────┘
```

---

## 📱 **UPI Integration**

### **Add/Update UPI ID:**

```
┌─────────────────────────────────────────┐
│ 📱 Add UPI ID                           │
├─────────────────────────────────────────┤
│ UPI ID: *                               │
│ [rajesh@paytm]                          │
│                                         │
│ Common UPI formats:                     │
│ • yourname@paytm                        │
│ • 9876543210@ybl                        │
│ • yourname@oksbi                        │
│                                         │
│ [Verify UPI ID]                         │
│                                         │
│ Status: ⏳ Verifying...                 │
│                                         │
│ [Cancel]  [Save]                        │
└─────────────────────────────────────────┘
```

### **UPI Verification:**
```
Verification Steps:
1. Check UPI format
2. Validate with payment gateway
3. Send ₹1 test transaction
4. Confirm receipt
5. Mark as verified ✅
```

---

## 🔐 **Security Features**

### **1. Payment Hold:**
- Buyer payment held by platform
- Released only after order completion
- Refund if order cancelled

### **2. Dispute Protection:**
- Wallet amount frozen during disputes
- Released after resolution
- Partial refunds supported

### **3. KYC Verification:**
- Required for redemptions > ₹10,000/day
- Aadhaar verification
- PAN card verification

### **4. Transaction Limits:**
```
Daily Limits:
- Redemption: ₹50,000/day
- Wallet balance: Unlimited
- Minimum redemption: ₹100
```

---

## 📊 **Admin Dashboard - Payment Management**

### **Platform Revenue:**
```
┌─────────────────────────────────────────┐
│ 💰 Platform Revenue                     │
├─────────────────────────────────────────┤
│ Today: ₹2,340                           │
│ This Month: ₹45,600                     │
│ Total: ₹2,34,500                        │
│                                         │
│ Commission Rate: 10%                    │
│ Total Orders: 234                       │
│ Avg Commission: ₹195                    │
└─────────────────────────────────────────┘
```

### **Pending Redemptions:**
```
┌─────────────────────────────────────────┐
│ ⏳ Pending Redemptions                  │
├─────────────────────────────────────────┤
│ Rajesh Kumar    | ₹12,500 | [Approve]  │
│ Priya Shah      | ₹8,900  | [Approve]  │
│ Arun Verma      | ₹15,200 | [Approve]  │
│                                         │
│ Total Pending: ₹36,600                  │
└─────────────────────────────────────────┘
```

---

## 🎨 **Implementation Files**

### **1. Update User Type:**
```typescript
// src/types/index.ts
export interface User {
  // ... existing fields
  upiId?: string;
  upiVerified?: boolean;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
  };
  wallet: {
    balance: number;
    pendingAmount: number;
    totalEarnings: number;
  };
}
```

### **2. Create Wallet Service:**
```typescript
// src/services/walletService.ts
export const walletService = {
  getBalance: (userId: string) => number,
  creditWallet: (userId: string, amount: number, orderId: string),
  debitWallet: (userId: string, amount: number, reason: string),
  redeemToUPI: (userId: string, amount: number, upiId: string),
  getTransactions: (userId: string) => Transaction[],
  calculateCommission: (amount: number) => { platform: number, artisan: number }
};
```

### **3. Create Wallet Page:**
```typescript
// src/pages/WalletPage.tsx
- Wallet balance display
- UPI ID management
- Redeem payment button
- Transaction history
- Bank details form
```

---

## 💡 **Key Features Summary**

### **For Artisans:**
- ✅ Add UPI ID
- ✅ View wallet balance
- ✅ Redeem to UPI instantly
- ✅ Track all transactions
- ✅ See commission breakdown
- ✅ Add bank details (backup)

### **For Platform:**
- ✅ 10% commission on sales
- ✅ Automatic commission calculation
- ✅ Hold payments until delivery
- ✅ Process redemptions
- ✅ Track platform revenue

### **For Buyers:**
- ✅ Secure payments
- ✅ Money held until delivery
- ✅ Refund protection
- ✅ Transaction tracking

---

## 🚀 **Next Steps to Implement**

1. **Update User Interface** - Add wallet fields
2. **Create Wallet Page** - UI for artisans
3. **Add UPI Form** - Registration & verification
4. **Implement Commission** - Auto-calculate on orders
5. **Create Redemption Flow** - UPI transfer
6. **Add Transaction History** - Track all payments
7. **Admin Controls** - Approve redemptions

---

**🎉 Complete wallet system with UPI integration ready to implement!**
