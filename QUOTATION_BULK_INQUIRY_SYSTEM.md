# 📋 Quotation & Bulk Inquiry System

## 🎯 **Overview**

Complete system for:
1. **Artisans** - Review orders & send quotations
2. **Buyers** - Request bulk inquiries
3. **Coordinators** - Manage all quotations & inquiries

---

## 📊 **System Architecture**

### **Flow Diagram:**
```
Buyer submits bulk inquiry
    ↓
Coordinator reviews & assigns to artisan
    ↓
Artisan reviews order details
    ↓
Artisan sends quotation
    ↓
Buyer reviews quotation
    ↓
Buyer accepts/rejects/negotiates
    ↓
If accepted → Order created
```

---

## 💼 **Data Structures**

### **1. Bulk Inquiry:**
```typescript
interface BulkInquiry {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  
  // Product Details
  productType: string;
  category: string;
  description: string;
  quantity: number;
  
  // Requirements
  specifications?: string;
  referenceImages?: string[];
  deliveryDeadline?: string;
  budgetRange?: {
    min: number;
    max: number;
  };
  
  // Status
  status: 'pending' | 'assigned' | 'quoted' | 'negotiating' | 'accepted' | 'rejected' | 'completed';
  assignedTo?: string; // artisan ID
  assignedBy?: string; // coordinator ID
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### **2. Quotation:**
```typescript
interface Quotation {
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
  updatedAt: string;
}
```

---

## 🛍️ **Buyer Dashboard - Bulk Inquiry**

### **New Tab: "Bulk Orders"**

```
┌─────────────────────────────────────────────┐
│ 📦 Bulk Order Inquiries                     │
├─────────────────────────────────────────────┤
│ [+ Request Bulk Inquiry]                    │
│                                             │
│ My Inquiries (3)                            │
│ ┌─────────────────────────────────────┐   │
│ │ Inquiry #001                        │   │
│ │ 100 Blue Pottery Vases              │   │
│ │ Status: Quoted                      │   │
│ │ Quotation: ₹95,000                  │   │
│ │ [View Details] [Accept] [Negotiate] │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ Inquiry #002                        │   │
│ │ 50 Handwoven Carpets                │   │
│ │ Status: Pending Assignment          │   │
│ │ [View Details]                      │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### **Request Bulk Inquiry Form:**
```
┌─────────────────────────────────────────────┐
│ 📋 Request Bulk Inquiry                     │
├─────────────────────────────────────────────┤
│ Product Type: *                             │
│ [Blue Pottery Vases]                        │
│                                             │
│ Category: *                                 │
│ [Pottery ▼]                                 │
│                                             │
│ Quantity: *                                 │
│ [100 units]                                 │
│                                             │
│ Description: *                              │
│ [Detailed description of requirements...]  │
│                                             │
│ Specifications:                             │
│ [Size, color, design details...]           │
│                                             │
│ Budget Range:                               │
│ Min: [₹800] Max: [₹1,200] per unit         │
│                                             │
│ Delivery Deadline:                          │
│ [2025-11-15]                                │
│                                             │
│ Reference Images:                           │
│ [Upload Images] [+ Add More]               │
│                                             │
│ Contact Details:                            │
│ Phone: [9876543210]                         │
│ Email: [anjali@kalamitra.com]              │
│                                             │
│ [Cancel] [Submit Inquiry]                  │
└─────────────────────────────────────────────┘
```

---

## 🎨 **Artisan Dashboard - Quotations**

### **New Tab: "Quotations"**

```
┌─────────────────────────────────────────────┐
│ 💼 My Quotations                            │
├─────────────────────────────────────────────┤
│ Pending Inquiries (2)                       │
│ ┌─────────────────────────────────────┐   │
│ │ Inquiry #001                        │   │
│ │ From: Anjali Mehta                  │   │
│ │ 100 Blue Pottery Vases              │   │
│ │ Budget: ₹800-1,200/unit             │   │
│ │ Deadline: Nov 15, 2025              │   │
│ │ [Review Details] [Send Quotation]  │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Sent Quotations (3)                         │
│ ┌─────────────────────────────────────┐   │
│ │ Quote #Q001                         │   │
│ │ 100 units @ ₹950/unit = ₹95,000    │   │
│ │ Status: Awaiting Response           │   │
│ │ Valid Until: Oct 20, 2025           │   │
│ │ [View] [Edit] [Withdraw]           │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### **Send Quotation Form:**
```
┌─────────────────────────────────────────────┐
│ 📝 Send Quotation                           │
├─────────────────────────────────────────────┤
│ Inquiry Details:                            │
│ • Product: 100 Blue Pottery Vases           │
│ • Buyer: Anjali Mehta                       │
│ • Budget: ₹800-1,200/unit                   │
│                                             │
│ Your Quotation:                             │
│ ─────────────────────────────────────       │
│ Price per Unit: *                           │
│ [₹950]                                      │
│                                             │
│ Total Quantity: *                           │
│ [100 units]                                 │
│                                             │
│ Total Price:                                │
│ ₹95,000 (Auto-calculated)                   │
│                                             │
│ Description: *                              │
│ [Handcrafted blue pottery vases with        │
│  traditional Jaipur designs...]             │
│                                             │
│ Specifications:                             │
│ [Height: 12 inches, Diameter: 6 inches,     │
│  Material: Clay, Glaze: Blue & White]       │
│                                             │
│ Materials Used:                             │
│ [Clay, Blue Glaze, White Paint]            │
│                                             │
│ Estimated Delivery: *                       │
│ [45 days from order confirmation]           │
│                                             │
│ Payment Terms: *                            │
│ [50% advance, 50% on delivery]             │
│                                             │
│ Delivery Terms:                             │
│ [Free delivery within Rajasthan,            │
│  ₹500 per unit for other states]           │
│                                             │
│ Valid Until: *                              │
│ [2025-10-20]                                │
│                                             │
│ Sample Images:                              │
│ [Upload Sample Photos] [+ Add More]        │
│                                             │
│ Additional Notes:                           │
│ [Custom designs available, bulk             │
│  discounts for 200+ units...]              │
│                                             │
│ [Save as Draft] [Send Quotation]           │
└─────────────────────────────────────────────┘
```

---

## ⚖️ **Coordinator Dashboard - Manage All**

### **New Tab: "Bulk Orders Management"**

```
┌─────────────────────────────────────────────┐
│ 📊 Bulk Orders Management                   │
├─────────────────────────────────────────────┤
│ Filters: [All] [Pending] [Assigned]         │
│          [Quoted] [Completed]               │
│                                             │
│ Pending Assignment (2)                      │
│ ┌─────────────────────────────────────┐   │
│ │ Inquiry #002                        │   │
│ │ From: Anjali Mehta                  │   │
│ │ 50 Handwoven Carpets                │   │
│ │ Budget: ₹5,000-8,000/unit           │   │
│ │ [View Details] [Assign Artisan]    │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Assigned & In Progress (3)                  │
│ ┌─────────────────────────────────────┐   │
│ │ Inquiry #001                        │   │
│ │ Assigned to: Rajesh Kumar           │   │
│ │ Status: Quotation Sent              │   │
│ │ Quote: ₹95,000                      │   │
│ │ [Monitor] [Reassign] [Contact]     │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Completed Orders (5)                        │
│ [View All]                                  │
└─────────────────────────────────────────────┘
```

### **Assign Artisan Modal:**
```
┌─────────────────────────────────────────────┐
│ 👤 Assign Artisan                           │
├─────────────────────────────────────────────┤
│ Inquiry: 50 Handwoven Carpets               │
│ Buyer: Anjali Mehta                         │
│                                             │
│ Select Artisan: *                           │
│ ┌─────────────────────────────────────┐   │
│ │ ○ Rajesh Kumar (Pottery)            │   │
│ │   5 products | 4.8★ rating          │   │
│ │                                     │   │
│ │ ● Meera Devi (Textiles)            │   │
│ │   12 products | 4.9★ rating         │   │
│ │   Specializes in carpets ✓          │   │
│ │                                     │   │
│ │ ○ Arun Verma (Woodwork)            │   │
│ │   8 products | 4.7★ rating          │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Assignment Note:                            │
│ [Please review and send quotation          │
│  within 3 days...]                         │
│                                             │
│ [Cancel] [Assign Artisan]                  │
└─────────────────────────────────────────────┘
```

---

## 🔄 **Complete Workflow**

### **Step 1: Buyer Submits Inquiry**
```
Buyer Dashboard → Bulk Orders → Request Inquiry
↓
Fill form:
- Product type
- Quantity
- Budget range
- Specifications
- Deadline
↓
Submit → Status: Pending
↓
Notification to Coordinator
```

### **Step 2: Coordinator Assigns Artisan**
```
Coordinator Dashboard → Bulk Orders Management
↓
View pending inquiry
↓
Select suitable artisan based on:
- Specialty match
- Rating
- Capacity
- Location
↓
Assign → Status: Assigned
↓
Notification to Artisan
```

### **Step 3: Artisan Reviews & Quotes**
```
Artisan Dashboard → Quotations
↓
View inquiry details:
- Product requirements
- Quantity
- Budget range
- Deadline
↓
Prepare quotation:
- Price per unit
- Total price
- Delivery time
- Terms & conditions
- Sample images
↓
Send quotation → Status: Quoted
↓
Notification to Buyer
```

### **Step 4: Buyer Reviews Quotation**
```
Buyer Dashboard → Bulk Orders
↓
View quotation details
↓
Options:
1. Accept → Order created
2. Reject → Status: Rejected
3. Negotiate → Counter offer
```

### **Step 5: Negotiation (Optional)**
```
Buyer sends counter offer
↓
Artisan reviews
↓
Artisan accepts/rejects/counter
↓
Back and forth until agreement
↓
Final acceptance → Order created
```

### **Step 6: Order Creation**
```
Quotation accepted
↓
Automatic order creation:
- Product details from quotation
- Quantity & pricing locked
- Payment terms set
- Delivery timeline set
↓
Status: Completed (Inquiry)
Status: Active (Order)
↓
Regular order flow begins
```

---

## 📊 **Dashboard Enhancements**

### **Buyer Dashboard - New Tab:**
```typescript
const [activeTab, setActiveTab] = useState<
  'marketplace' | 'orders' | 'wishlist' | 'bulk-orders'
>('marketplace');

// Add Bulk Orders tab
<button onClick={() => setActiveTab('bulk-orders')}>
  📦 Bulk Orders
</button>
```

### **Artisan Dashboard - New Tab:**
```typescript
const [activeTab, setActiveTab] = useState<
  'products' | 'orders' | 'quotations'
>('products');

// Add Quotations tab
<button onClick={() => setActiveTab('quotations')}>
  💼 Quotations
</button>
```

### **Coordinator Dashboard - New Tab:**
```typescript
const [activeTab, setActiveTab] = useState<
  'qc' | 'analytics' | 'bulk-orders'
>('qc');

// Add Bulk Orders Management tab
<button onClick={() => setActiveTab('bulk-orders')}>
  📊 Bulk Orders
</button>
```

---

## 🎨 **UI Components to Create**

### **1. BulkInquiryForm.tsx**
- Product details input
- Quantity selector
- Budget range slider
- Specifications textarea
- Image upload
- Deadline picker

### **2. QuotationForm.tsx**
- Price calculator
- Specifications editor
- Terms & conditions
- Sample image upload
- Validity date picker

### **3. InquiryCard.tsx**
- Inquiry summary
- Status badge
- Action buttons
- Timeline view

### **4. QuotationCard.tsx**
- Quotation details
- Pricing breakdown
- Accept/Reject buttons
- Negotiation interface

### **5. AssignArtisanModal.tsx**
- Artisan list with filters
- Specialty matching
- Assignment notes
- Notification options

---

## 📈 **Statistics & Analytics**

### **For Buyers:**
```
Total Inquiries: 5
Pending: 2
Quoted: 2
Accepted: 1
Average Response Time: 2.5 days
```

### **For Artisans:**
```
Inquiries Received: 8
Quotations Sent: 6
Acceptance Rate: 75%
Average Quote Value: ₹85,000
```

### **For Coordinators:**
```
Total Inquiries: 15
Assigned: 12
Pending Assignment: 3
Conversion Rate: 60%
Average Assignment Time: 1.2 days
```

---

## 🔔 **Notifications**

### **Buyer Notifications:**
- ✅ Inquiry received
- ✅ Artisan assigned
- ✅ Quotation received
- ✅ Quotation accepted/rejected
- ✅ Negotiation message

### **Artisan Notifications:**
- ✅ New inquiry assigned
- ✅ Quotation viewed by buyer
- ✅ Quotation accepted
- ✅ Negotiation message
- ✅ Order created

### **Coordinator Notifications:**
- ✅ New inquiry submitted
- ✅ Quotation sent
- ✅ Quotation accepted
- ✅ Inquiry rejected
- ✅ Assignment needed

---

## 🎯 **Key Features Summary**

### **For Buyers:**
- ✅ Submit bulk inquiries
- ✅ Specify requirements
- ✅ Set budget range
- ✅ Upload reference images
- ✅ Review quotations
- ✅ Accept/reject/negotiate
- ✅ Track inquiry status

### **For Artisans:**
- ✅ View assigned inquiries
- ✅ Review requirements
- ✅ Send detailed quotations
- ✅ Upload sample images
- ✅ Set pricing & terms
- ✅ Negotiate with buyers
- ✅ Track quotation status

### **For Coordinators:**
- ✅ View all inquiries
- ✅ Assign to suitable artisans
- ✅ Monitor progress
- ✅ Reassign if needed
- ✅ View analytics
- ✅ Manage disputes

---

## 🚀 **Implementation Priority**

### **Phase 1: Basic Structure**
1. Create data types
2. Add tabs to dashboards
3. Create basic forms

### **Phase 2: Core Features**
1. Bulk inquiry submission
2. Artisan assignment
3. Quotation sending
4. Accept/reject flow

### **Phase 3: Advanced Features**
1. Negotiation system
2. Sample images
3. Analytics dashboard
4. Notifications

### **Phase 4: Polish**
1. UI improvements
2. Validation
3. Error handling
4. Performance optimization

---

**🎉 Complete Quotation & Bulk Inquiry System Ready to Implement!**
