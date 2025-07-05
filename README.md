# 🛒 Walmart TrustLens

> **Revolutionizing retail through transparency, trust, and intelligent shopping insights**

A cutting-edge Next.js application that transforms shopping decisions by combining **verified product transparency** with **community-driven insights** to create the ultimate trusted omnichannel Walmart experience.

## 🌐 Live Demo

**🚀 [View Live Application](https://walmart-trust-lens.vercel.app)**

Experience authentic social proof scanning and sustainable shopping gamification in action.

## 🌟 Core Features

### 📱 **Social Proof Scanner**
**The future of trusted product validation**

- **Advanced Product Scanning** - Scan QR codes, barcodes, and even analyze products through AI-powered image recognition
- **Trusted Social Validation** - Instantly see which friends from your contact list (anonymized for privacy) have purchased similar products
- **Community & Location Insights** - Access trending products and purchase patterns within your local community and peer group
- **Real-time Product Intelligence** - Detailed product information, authentic reviews, and live community discussions
- **Privacy-First Social Proof** - Friend connections remain completely anonymous while providing valuable insights
- **Omnichannel Integration** - Seamless experience between online and offline shopping

### 🌱 **Sustainability Hub - Greener Cart Gamification**
**Transforming eco-conscious shopping into an engaging experience**

- **Greener Cart System** - Earn "green points" for adding sustainable products to your cart
- **Eco-Score Display** - Clear sustainability ratings (carbon footprint, recyclability) for every product
- **AI-Powered Eco-Scanner** - Upload images of items to get disposal recommendations and environmental impact analysis
- **Personal Impact Tracking** - Visualize your individual environmental contribution with progress dashboards
- **Community Achievements** - Badges, leaderboards, and shareable milestones for sustainable actions
- **Carbon Footprint Tracker** - Monitor and reduce your shopping-related environmental impact
- **Waste Management Integration** - Find nearby drop-off locations for recycling and proper disposal

### 🤖 **AI-Powered Shopping Assistant**
**Intelligent companion for smarter shopping decisions**

- **Natural Language Queries** - Ask questions about products in plain English
- **Contextual Recommendations** - Suggestions based on social proof, sustainability, and personal preferences
- **Multi-model AI Integration** - Powered by OpenRouter with access to multiple advanced AI models
- **Real-time Product Analysis** - Instant insights on quality, value, and environmental impact

### 🏆 **Achievement & Progress System**
**Gamified experience that drives engagement**

- **Multi-tier Badge System** - Unlock achievements for scanning, sustainable choices, and community participation
- **Dynamic Leaderboards** - Compete with friends and community in various sustainability categories
- **Progress Tracking** - Visual dashboards showing scanning history, green points, and environmental impact
- **Social Sharing** - Share achievements and milestones across social platforms

### 👥 **Community Features**
**Connect with like-minded shoppers**

- **Social Feed** - See recent scans and achievements from your network
- **Trending Topics** - Discover popular products and sustainable trends in your area
- **Community Stats** - Local and global impact metrics from the user community
- **User Classification** - Intelligent categorization for personalized experiences

## 🛠️ Tech Stack

### **Core Framework**
- **Next.js 15.2.4** - React framework with App Router for optimal performance
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript 5.6.3** - Type-safe development for enterprise-grade reliability

### **Scanner & Camera Technology**
- **@zxing/library** - Advanced barcode and QR code scanning engine
- **Browser Camera API** - Direct camera access for seamless scanning experience
- **Real-time Processing** - Optimized frame processing for mobile devices

### **AI & Intelligence**
- **OpenRouter API** - Multi-model AI assistant with intelligent product recommendations
- **Claude 3.5 Sonnet** - Advanced image analysis for eco-scanner functionality
- **Barcode Lookup API** - Real-time product data retrieval and validation
- **Real-time Chat Interface** - Natural language product queries and support

### **UI & Styling**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework for rapid development
- **Radix UI Components** - Accessible, unstyled component primitives
- **Lucide React** - Beautiful, consistent icon system
- **Next Themes** - Seamless dark/light mode support

### **Data & Analytics**
- **Recharts** - Interactive charts for sustainability tracking and social insights
- **Progress Indicators** - Visual feedback for user engagement and achievements

### **Mobile & Performance**
- **PWA Ready** - Progressive Web App capabilities for native-like mobile experience
- **Optimized Scanning** - Efficient barcode detection with minimal resource usage
- **Responsive Design** - Mobile-first approach with cross-device compatibility

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
   Create a `.env.local` file:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NEXT_PUBLIC_BARCODE_API_KEY=your_barcode_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Getting OpenRouter API Key:**
   1. Visit [OpenRouter.ai](https://openrouter.ai/)
   2. Sign up for an account
   3. Go to API Keys section
   4. Create a new API key
   5. Copy the key to your `.env.local` file

   **Note:** The eco-scanner uses Claude 3.5 Sonnet via OpenRouter for advanced image analysis.

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

## 📱 Application Architecture

### **Key Pages & Routes**

- **`/`** - Enhanced home page with comprehensive feature showcase and quick actions
- **`/scanner`** - Advanced scanning interface with camera functionality and social validation
- **`/assistant`** - AI-powered shopping assistant with personalized recommendations
- **`/achievements`** - Gamified sustainability progress and social achievements dashboard
- **`/social`** - Community insights, trending products, and social feed
- **`/sustainability`** - Environmental impact dashboard, eco-scanner, and carbon tracking

### **Component Structure**

```
components/
├── camera/                 # Camera scanning functionality
├── onboarding/            # User onboarding flow
├── settings/              # User preferences and profile
├── ui/                    # Reusable UI components (Radix UI based)
├── achievement-grid.tsx   # Achievement system display
├── ai-chat.tsx           # AI assistant interface
├── carbon-tracker.tsx    # Environmental impact tracking
├── eco-scanner.tsx       # Waste management and disposal recommendations
├── social-feed.tsx       # Community activity feed
├── sustainable-products.tsx # Eco-friendly product recommendations
└── ...
```

### **API Endpoints**

- **`/api/chat`** - AI assistant conversations
- **`/api/eco-scan`** - Image analysis for sustainability recommendations
- **`/api/health`** - Application health monitoring
- **`/api/product-scan`** - Product information retrieval

## 🎯 Impact & Innovation

### **Social Trust Revolution**
- **Authentic Validation** - Move beyond anonymous reviews to trusted network recommendations
- **Privacy-First Approach** - Leverage social connections while maintaining complete anonymity
- **Community-Driven Insights** - Hyper-local and peer-relevant product intelligence

### **Sustainability Leadership**
- **Gamified Green Shopping** - Transform eco-conscious shopping into an engaging, rewarding experience
- **Supply Chain Influence** - Drive corporate sustainability through informed consumer demand
- **Measurable Impact** - Track individual and community environmental contributions with precision

### **Technology Innovation**
- **Advanced AI Integration** - Multi-model AI for image analysis, recommendations, and natural language processing
- **Real-time Social Proof** - Instant access to trusted network insights while protecting privacy
- **Omnichannel Excellence** - Unified experience across online and offline shopping channels

## 🔧 Development Features

### **Code Quality & Testing**
- **TypeScript** - Full type safety across the application
- **ESLint & Prettier** - Consistent code formatting and linting
- **Component Testing** - Comprehensive testing for critical user flows

### **Performance Optimizations**
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic route-based code splitting
- **Progressive Enhancement** - Works across all device capabilities

### **Mobile-First Design**
- **Responsive Components** - All components optimized for mobile devices
- **Touch-Friendly Interface** - Optimized touch targets and gestures
- **Offline Capabilities** - Core features work without internet connection

## 🌐 Browser Compatibility

- ✅ **Modern Mobile Browsers** - Optimized for iOS Safari and Android Chrome
- ✅ **Desktop Browsers** - Full feature support on all modern browsers
- ✅ **Camera API Support** - Advanced scanning capabilities on supported devices
- ✅ **Progressive Enhancement** - Graceful degradation for older browsers

## 🔒 Privacy & Security

- **Anonymous Social Proof** - Friend connections remain completely anonymous
- **Local Processing** - Camera scanning processed locally, no video data transmitted
- **Secure API Endpoints** - Protected AI assistant and product lookup interactions
- **Privacy-First Design** - User data handled with enterprise-grade security
- **GDPR Compliant** - Full compliance with international privacy regulations

## 🚀 Future Roadmap

### **Enhanced AI Features**
- Voice-activated product queries
- Predictive shopping recommendations
- Advanced sustainability scoring algorithms

### **Extended Social Features**
- Shopping lists sharing with trusted networks
- Group purchasing coordination
- Collaborative sustainability challenges

### **Business Intelligence**
- Advanced analytics dashboard for retailers
- Supply chain sustainability insights
- Consumer behavior pattern analysis

---

## 📈 Performance Metrics

- **Scan Speed**: < 2 seconds for product recognition
- **AI Response Time**: < 3 seconds for complex queries
- **Mobile Performance**: 95+ Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Together, these features make Walmart SmartScan Pro a leader in combining social trust and sustainability, delivering an omnichannel, future-ready shopping experience.**

**Built with ❤️ for the future of retail**
