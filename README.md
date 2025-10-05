# 🎨 KalaMitra - AI-Powered Voice-First Artisan Marketplace

**KalaMitra** is a Progressive Web App (PWA) built with React + TypeScript that empowers Indian artisans to sell their handcrafted products directly to buyers with fair pricing, AI-powered storytelling, and voice-first interactions.

## 🌟 Features

### For Artisans
- **🎤 Voice-Guided Product Listing**: Record product descriptions in Hindi or English
- **🤖 AI Story Generation**: Automatic generation of compelling product stories and fair price suggestions
- **✅ Quality Control**: Complete QC checklist with photo verification to earn quality badges
- **📦 Order Management**: Track orders through all milestones with payment protection

### For Buyers
- **🛍️ Story-Driven Marketplace**: Discover products through authentic artisan stories
- **🔍 Smart Filters**: Search by region, category, and quality verification
- **📍 Regional Discovery**: Find products from specific Indian regions
- **🛡️ Protected Purchases**: Quality-assured products with secure payment

### For Coordinators
- **⚖️ Dispute Resolution**: Fair handling of buyer-artisan disputes with photo evidence
- **✓ Quality Verification**: Review and approve quality control submissions
- **💰 Payment Management**: Control payment release based on milestone completion

### Core Technology
- **Voice Recognition & TTS**: Web Speech API for Hindi/English support
- **Offline Support**: PWA with service worker for offline functionality
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Cultural Design**: Indian color palette (Saffron, Terracotta, Deep Blue, Gold)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with Web Speech API support (Chrome, Edge recommended)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd C:\Users\Welcome\CascadeProjects\kalamitra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎭 Demo Flow

### Artisan Journey
1. **Login** as an artisan (use demo: "Rajesh Kumar")
2. **Click "Add New Product"** 
3. **Click the microphone** and describe your product (or type)
4. **Wait for AI** to generate story and price suggestion
5. **Adjust details** and save
6. **Complete QC checklist** with photos to get quality badge
7. **View orders** and update status as you progress

### Buyer Journey
1. **Login** as a buyer (use demo: "Anjali Mehta")
2. **Browse marketplace** with story-driven product cards
3. **Filter by region** or quality verification
4. **Click a product** to view full story and details
5. **Place an order** and track milestones
6. **Raise disputes** if needed with photo evidence

### Coordinator Journey
1. **Login** as a coordinator
2. **Review pending orders** and quality checks
3. **Approve and release payments** for completed orders
4. **Handle disputes** fairly with photo evidence review
5. **Resolve issues** between artisans and buyers

## 📱 PWA Installation

When running in production, you can install KalaMitra as a PWA:
1. Click the install icon in your browser's address bar
2. Or select "Add to Home Screen" from the browser menu
3. Launch from your device's home screen like a native app

## 🎨 Design System

### Color Palette
- **Saffron** (#FFC107): Primary accent, cultural identity
- **Terracotta** (#FF7043): Secondary accent, warmth
- **Deep Blue** (#1976D2): Trust, stability
- **Gold** (#FFBF00): Premium quality, celebration

### Typography
- **Inter**: Primary sans-serif (English)
- **Noto Sans Devanagari**: Hindi text support

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa + Workbox
- **State Management**: React Context + useReducer
- **Voice**: Web Speech API (Recognition + Synthesis)
- **Persistence**: localStorage

## 📂 Project Structure

```
kalamitra/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── VoiceInput.tsx
│   │   ├── QualityCheckForm.tsx
│   │   ├── ProductCard.tsx
│   │   └── OrderCard.tsx
│   ├── context/           # State management
│   │   ├── AppContext.tsx
│   │   └── appReducer.ts
│   ├── pages/             # Main page components
│   │   ├── LoginPage.tsx
│   │   ├── ArtisanDashboard.tsx
│   │   ├── BuyerMarketplace.tsx
│   │   └── CoordinatorDashboard.tsx
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── voiceUtils.ts
│   │   ├── aiService.ts
│   │   └── demoData.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎯 Key Features Implementation

### Voice Recognition
- Uses Web Speech API for real-time transcription
- Supports both Hindi (`hi-IN`) and English (`en-IN`)
- Visual feedback during listening/speaking
- Fallback to text input if not supported

### AI Story Generation (Mock)
- Analyzes product description keywords
- Generates culturally relevant stories
- Calculates fair pricing based on category and complexity
- Suggests appropriate materials and category

### Quality Control
- 5-point checklist (materials, craftsmanship, dimensions, finishing, packaging)
- Photo upload requirement for verification
- Badge awarded upon completion
- Increases buyer trust and product visibility

### Order Tracking
- Milestone-based progression
- Status updates: pending → accepted → in_progress → quality_check → shipped → delivered → completed
- Payment release controlled by coordinator
- Transparent for all parties

## 🌐 Browser Support

- Chrome/Edge (recommended for full voice support)
- Firefox (limited voice support)
- Safari (basic functionality)

## 📝 License

This project is created as a demonstration and is open for educational purposes.

## 🙏 Acknowledgments

Built with ❤️ to empower Indian artisans and preserve traditional crafts through modern technology.

---

**Made with 🎨 for KalaMitra**
