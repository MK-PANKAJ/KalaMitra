# 🔧 Fix Database Issues - Quick Guide

## 🎯 The Problem

You're seeing old cached data because your browser saved the old database structure where `admin@kalamitra.com` was a coordinator.

## ✅ Solution: Use Database Reset Tool

### **Step 1: Open Reset Tool**
```
Go to: http://localhost:5173/reset-database.html
```

### **Step 2: Click "Reset Database" Button**
- This will clear all old data
- Create new database with 4 accounts
- You'll see a success message

### **Step 3: Click "Go to App"**
- Returns you to the main app
- Now you can login with correct accounts

---

## 🔐 New Accounts (After Reset)

### **1. Admin (Full Control)**
```
Email: admin@kalamitra.com
Password: admin123
Name: Super Admin
Role: admin

Features:
✅ Dashboard with 4 tabs (Overview, User Management, Manage Schemes, Analytics)
✅ Add/edit/delete government schemes
✅ Manage all users
✅ View platform analytics
✅ Export platform data
```

### **2. Coordinator (QC + Support)**
```
Email: coordinator@kalamitra.com
Password: coordinator123
Name: QC Coordinator
Role: coordinator

Features:
✅ Quality Control approval
✅ Order management
✅ Dispute resolution
✅ View analytics
✅ View government schemes
```

### **3. Artisan**
```
Email: rajesh@kalamitra.com
Password: artisan123
```

### **4. Buyer**
```
Email: anjali@kalamitra.com
Password: buyer123
```

---

## 🔍 What Each Admin Tab Does

### **Overview Tab:**
- Platform statistics (users, products, orders, revenue)
- Recent user registrations
- Quick actions (Add Scheme, Manage Users, Export Data, Generate Reports)

### **User Management Tab:**
- Table showing all users
- Edit/delete user buttons
- Role badges (color-coded)
- User details (name, role, region, language)

### **Manage Schemes Tab:**
- "+ Add New Scheme" button
- Form to add government schemes:
  - Scheme name
  - Ministry
  - Description
  - Category (Finance/Training/Marketing/Export)
  - Status (Active/Upcoming/Closed)
  - Application link
  - Benefits (multiple)
  - Eligibility criteria (multiple)
- View existing schemes with edit/delete options

### **Platform Analytics Tab:**
- Total GMV (Gross Merchandise Value)
- Active products count
- Conversion rate
- Platform-wide performance metrics

---

## 🎨 Admin Navigation

**Admin sees only 2 buttons:**
```
[Dashboard] [Analytics]
```

**Admin dashboard shows 4 tabs:**
```
[Overview] [User Management] [Manage Schemes] [Platform Analytics]
```

**Everything admin needs is inside the dashboard tabs!**

---

## 🐛 Troubleshooting

### **Issue: "Coordinator can't login"**
**Solution:** After using reset tool, the email changed from `admin@kalamitra.com` to `coordinator@kalamitra.com`

### **Issue: "Admin doesn't have controls"**
**Solution:** Admin controls are inside the Dashboard page, not in navigation buttons. Look for the 4 tabs.

### **Issue: "Still seeing old data"**
**Solution:** 
1. Use the reset tool again
2. Or manually run in browser console:
   ```javascript
   localStorage.clear(); sessionStorage.clear(); location.reload();
   ```

---

## ✅ Verification Steps

After using reset tool:

**1. Test Admin Login:**
```
1. Login: admin@kalamitra.com / admin123
2. Check subtitle: Should show "🛡️ Admin Control Panel"
3. Check navigation: Should see [Dashboard] [Analytics]
4. Click Dashboard → Should see 4 tabs
5. Click "Manage Schemes" tab → Should see "+ Add New Scheme" button
6. Click "User Management" tab → Should see all 4 users in table
```

**2. Test Coordinator Login:**
```
1. Logout
2. Login: coordinator@kalamitra.com / coordinator123
3. Check subtitle: Should show "⚖️ Coordinator Dashboard"
4. Check navigation: Should see [Dashboard] [Messages] [Academy] [Analytics] [Schemes]
5. Click Dashboard → Should see QC/Orders/Disputes tabs
```

---

## 🚀 Quick Fix Command

If reset tool doesn't work, open browser console (F12) and paste:

```javascript
// Clear and reset database
localStorage.clear();
sessionStorage.clear();

// Create new database
const newDb = {
    users: [
        {id: 'user-artisan-1', name: 'Rajesh Kumar', email: 'rajesh@kalamitra.com', password: 'artisan123', role: 'artisan', language: 'en', region: 'Jaipur, Rajasthan'},
        {id: 'user-buyer-1', name: 'Anjali Mehta', email: 'anjali@kalamitra.com', password: 'buyer123', role: 'buyer', language: 'en', region: 'Mumbai, Maharashtra', wishlist: []},
        {id: 'user-coordinator-1', name: 'QC Coordinator', email: 'coordinator@kalamitra.com', password: 'coordinator123', role: 'coordinator', language: 'en', region: 'Delhi'},
        {id: 'user-admin-1', name: 'Super Admin', email: 'admin@kalamitra.com', password: 'admin123', role: 'admin', language: 'en', region: 'New Delhi'}
    ],
    products: [],
    orders: [],
    disputes: []
};

localStorage.setItem('kalamitra_backend_db', JSON.stringify(newDb));
location.reload();
```

---

## 📊 Summary

**What Changed:**
- Old: `admin@kalamitra.com` = Coordinator
- New: `admin@kalamitra.com` = Admin (full control)
- New: `coordinator@kalamitra.com` = Coordinator (QC + support)

**How to Fix:**
1. Go to http://localhost:5173/reset-database.html
2. Click "Reset Database"
3. Click "Go to App"
4. Login with correct accounts

**Admin Controls Location:**
- Not in navigation buttons!
- Inside Dashboard → 4 tabs (Overview, Users, Schemes, Analytics)

---

**Use the reset tool and everything will work perfectly! 🎉**
