# 🔐 Backend Integration & Account System

KalaMitra now has a **fully integrated backend system** that links all user accounts (Artisan, Buyer, Coordinator) with shared data.

## 🎯 Key Features

### ✅ **Account System**
- **Email/Password Authentication**: Secure login system
- **User Registration**: Create new accounts for any role
- **Persistent Storage**: All data saved in localStorage (production would use real database)
- **Role-Based Access**: Different views and permissions for each user type

### ✅ **Data Linking**
All accounts are **interlinked** through a shared backend:

```
┌─────────────┐
│  ARTISAN    │──┐
│ (Rajesh)    │  │
└─────────────┘  │
                 ├──► Orders ──┐
┌─────────────┐  │             ├──► Disputes
│   BUYER     │──┘             │
│ (Anjali)    │                │
└─────────────┘                │
                               │
┌─────────────┐                │
│ COORDINATOR │────────────────┘
│  (Admin)    │
└─────────────┘
```

### 🔗 **How Accounts Are Linked**

#### **Products**
- Created by: **Artisans** only
- Visible to: **Everyone**
- Editable by: **Original artisan** only

#### **Orders**
- Created by: **Buyers**
- Links: `buyerId` ↔ `artisanId`
- Both parties can see order status
- Coordinators can manage payment release

#### **Disputes**
- Created by: **Buyers** or **Artisans**
- Related to specific order
- Resolved by: **Coordinators**
- All involved parties can see the dispute

## 🚀 Using The System

### **Demo Accounts (Pre-configured)**

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| 🎨 Artisan | rajesh@kalamitra.com | artisan123 | Create products, manage orders |
| 🛍️ Buyer | anjali@kalamitra.com | buyer123 | Browse & purchase products |
| ⚖️ Coordinator | admin@kalamitra.com | admin123 | Manage disputes & QC |

### **Login Flow**

1. **Visit** http://localhost:5173
2. **Choose**: Sign In or Create Account
3. **Enter credentials** or use Quick Demo Login
4. **System loads** role-specific data automatically

### **Registration Flow**

1. Click **"Create Account"**
2. Enter:
   - Name
   - Email
   - Password (min 6 characters)
   - Select Role (Artisan/Buyer/Coordinator)
   - Region (if Artisan)
3. Click **"Create Account"**
4. System creates account and logs you in

## 🔐 Backend Service API

### **Authentication**

```typescript
// Login
const user = await backendService.login(email, password);

// Register
const user = await backendService.register(name, email, password, role, region);
```

### **Products**

```typescript
// Get products (filtered by role)
const products = await backendService.getProducts(userId, userRole);

// Add product (artisan only)
const product = await backendService.addProduct(productData);

// Update product
const updated = await backendService.updateProduct(productId, updates);

// Delete product
const success = await backendService.deleteProduct(productId);
```

### **Orders**

```typescript
// Get orders (role-based filtering)
const orders = await backendService.getOrders(userId, userRole);
// - Artisans see orders for their products
// - Buyers see their own orders
// - Coordinators see all orders

// Create order (buyer → artisan link)
const order = await backendService.addOrder(orderData);

// Update order status
const updated = await backendService.updateOrder(orderId, updates);
```

### **Disputes**

```typescript
// Get disputes (role-based)
const disputes = await backendService.getDisputes(userId, userRole);

// Create dispute
const dispute = await backendService.addDispute(disputeData);

// Resolve dispute (coordinator)
const resolved = await backendService.updateDispute(disputeId, resolution);
```

## 📊 Data Flow Example

### **Complete Transaction Flow**

1. **Artisan (Rajesh)** creates product
   ```
   Product ID: prod-123
   Artisan ID: user-artisan-1
   ```

2. **Buyer (Anjali)** places order
   ```
   Order ID: order-456
   Product ID: prod-123
   Buyer ID: user-buyer-1
   Artisan ID: user-artisan-1  ← LINKED!
   ```

3. **Both see the order**
   - Rajesh sees it in "Artisan Dashboard → My Orders"
   - Anjali sees it in "Buyer Marketplace → My Orders"

4. **If issue occurs**, Buyer raises dispute
   ```
   Dispute ID: dispute-789
   Order ID: order-456
   Raised By: user-buyer-1
   Involves: user-artisan-1  ← BOTH LINKED!
   ```

5. **Coordinator (Admin)** resolves
   ```
   Dispute resolution visible to all parties
   Payment released or refunded based on decision
   ```

## 🛡️ Security Features

- **Password Protection**: All accounts require authentication
- **Role-Based Access**: Users only see data they're authorized for
- **Data Isolation**: Artisans can't see other artisans' products in edit mode
- **Audit Trail**: All orders and disputes maintain user references
- **Secure Sessions**: User data stored securely in app state

## 💾 Data Persistence

All data is stored in **localStorage** under two keys:

1. `kalamitra_backend_db` - Backend database (users, products, orders, disputes)
2. `kalamitra_state` - Current session state (active user, UI state)

### **In Production**

Replace localStorage with:
- **Database**: PostgreSQL, MongoDB, or Firebase
- **Authentication**: JWT tokens, OAuth, or Auth0
- **API**: RESTful API or GraphQL
- **Cloud**: AWS, Google Cloud, or Azure

## 🧪 Testing The Integration

### **Test Scenario 1: Complete Product Lifecycle**

1. Login as **Rajesh** (Artisan)
2. Create a product with voice/AI
3. Complete QC checklist
4. Logout

5. Login as **Anjali** (Buyer)
6. Find Rajesh's product
7. Place an order
8. Note order appears in "My Orders"

9. Login as **Rajesh** again
10. See the order from Anjali in "My Orders"
11. Update order status

### **Test Scenario 2: Dispute Resolution**

1. Login as **Anjali** (Buyer)
2. Raise dispute on an order
3. Logout

4. Login as **Rajesh** (Artisan)
5. See the dispute notification

6. Login as **Admin** (Coordinator)
7. Review dispute with evidence
8. Resolve with decision

9. Login as either party - see resolution

## 🔄 Migration to Real Backend

When ready for production, update `backendService.ts`:

```typescript
// Replace localStorage with API calls
async login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
```

All components use the service abstraction, so no component code needs to change!

---

**🎉 The backend integration is complete and fully functional!** All accounts are properly linked, data is shared appropriately, and role-based access is enforced.
