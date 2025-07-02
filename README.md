# 🛒 Walmart SmartScan Pro

> **Revolutionizing retail through community-driven decisions and sustainable shopping**

A Next.js application that combines **social proof engine** with **environmental consciousness** to help customers make smarter, more sustainable purchasing decisions at Walmart.

## 🌐 Live Demo

**🚀 [View Live Application](https://walmart-trust-lens.vercel.app)**

Experience the full application with all features including camera scanning, AI assistant, and social proof engine.

## 🌟 Features

### 🔍 **Smart Scanner**
- **Advanced Barcode/QR Code Scanning** - Optimized camera interface using ZXing library
- **Real-time Product Recognition** - Instant product identification and details
- **Mobile-First Design** - Optimized for phone scanning with responsive UI

### 👥 **Social Proof Engine**
- **Friend Network Integration** - See what your contacts have purchased
- **Local Community Insights** - Discover popular products in your area
- **Similar Shopper Matching** - AI-powered recommendations from users with similar shopping patterns
- **Real-Time Activity** - Live purchasing trends and community discussions
- **Verified Reviews** - Access to 50M+ authentic customer reviews

### 🌱 **Sustainability Intelligence**
- **Carbon Footprint Calculator** - Track environmental impact of purchases
- **Eco-Score Rating System** - A+ to C sustainability grading for products
- **Sustainable Alternatives** - AI-recommended eco-friendly substitutions
- **Impact Tracking** - Personal and community environmental progress
- **Green Achievements** - Gamified environmental goals

### 🤖 **AI Assistant**
- **Personalized Shopping Assistant** - AI-powered product recommendations
- **Smart Chat Interface** - Natural language product queries
- **Shopping Optimization** - Intelligent suggestions for better purchases

### 📱 **Enhanced User Experience**
- **Personalized Dashboard** - Customized experience based on shopping patterns
- **User Classification System** - VIP, Frequent, Casual shopper profiles
- **Onboarding Flow** - Guided setup for new users
- **Recent Scans** - History of scanned products
- **Progress Tracking** - Shopping stats and achievements

### 🏆 **Gamification & Social**
- **Achievement System** - Unlock badges for shopping milestones
- **Leaderboards** - Community rankings for sustainable shopping
- **Social Feed** - Share and discover products with the community
- **Community Impact** - Track collective environmental savings

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 15.2.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type-safe development

### **Styling & UI**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI Components** - Accessible component primitives
  - Dialog, Dropdown, Navigation, Tabs, Toast, etc.
- **Lucide React** - Beautiful icons
- **Next Themes** - Dark/light mode support
- **Tailwind Animate** - CSS animations

### **Scanner & Camera**
- **@zxing/library** - Barcode and QR code scanning
- **Browser Camera API** - Direct camera access

### **AI & Chat**
- **OpenRouter API** - AI assistant functionality with multiple model support
- **Real-time chat interface** - Intelligent product recommendations

### **Data Visualization**
- **Recharts** - Charts and analytics
- **Progress indicators** - Visual feedback components

### **Forms & Validation**
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **PNPM** - Package manager

### **Additional Libraries**
- **date-fns** - Date utilities
- **clsx** - Conditional CSS classes
- **cmdk** - Command palette
- **class-variance-authority** - Component variants
- **Embla Carousel** - Image carousels
- **Sonner** - Toast notifications
- **Vaul** - Mobile-first drawer component

## 🚀 Deployment

The application is deployed on **Vercel** and accessible at:
**[https://walmart-trust-lens.vercel.app](https://walmart-trust-lens.vercel.app)**

### Deployment Features
- **Automatic deployments** from main branch
- **Preview deployments** for pull requests  
- **Edge runtime** for optimal performance
- **Global CDN** for fast content delivery

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd walmart-redesign
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📱 Key Pages & Routes

- **`/`** - Home page with hero, features, and social proof showcase
- **`/scanner`** - Main scanning interface with camera functionality
- **`/assistant`** - AI-powered shopping assistant
- **`/achievements`** - User achievements and progress tracking
- **`/social`** - Community feed and social interactions
- **`/sustainability`** - Environmental impact dashboard

## 🎯 Project Architecture

### **App Structure**
```
app/
├── globals.css           # Global styles
├── layout.tsx           # Root layout
├── page.tsx            # Home page
├── achievements/       # Achievement system
├── api/chat/          # AI chat API
├── assistant/         # AI assistant page
├── scanner/           # Scanner interface
├── social/            # Social features
└── sustainability/    # Environmental tracking
```

### **Components Organization**
```
components/
├── ui/                # Reusable UI components (Radix-based)
├── camera/            # Camera and scanner components
├── onboarding/        # User onboarding flow
├── settings/          # User settings
└── [feature-components] # Feature-specific components
```

## 🌐 Browser Compatibility

- ✅ **Modern browsers** with camera API support
- ✅ **Mobile Safari and Chrome** - Optimized for mobile scanning
- ✅ **Desktop browsers** with webcam access
- ✅ **Progressive enhancement** for older browsers

## 🔒 Privacy & Security

- **Local camera processing** - No video data sent to servers
- **Secure API endpoints** - Protected AI assistant interactions
- **Privacy-first design** - User data handled responsibly

## 📊 Performance Features

- **Optimized scanning frame** - 288x192px for better barcode detection
- **Reduced DOM complexity** - Improved performance
- **Mobile-first responsive design** - Smooth mobile experience
- **Code splitting** - Efficient bundle loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for better shopping experiences**
