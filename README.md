# 🛒 Walmart SmartScan Pro

> **Revolutionizing retail through trusted social proof and sustainable shopping**

A cutting-edge Next.js application that transforms shopping decisions by combining **real social validation** from your trusted network with **gamified sustainability** to create the ultimate omnichannel Walmart experience.

## 🌐 Live Demo

**🚀 [View Live Application](https://walmart-trust-lens.vercel.app)**

Experience authentic social proof scanning and sustainable shopping gamification in action.

## 🌟 Core Features

### � **Social Proof Scanner**
**The future of trusted product validation**

- **Seamless Product Scanning** - Scan any product's QR code or barcode using your mobile device
- **Trusted Social Validation** - Instantly see which friends from your contact list (anonymized for privacy) have purchased the same product or similar items in the category
- **Community & Location Insights** - Access trending products and purchase patterns within your local community and peer group for hyper-relevant recommendations
- **Omnichannel Experience** - Integrates both online and offline shopping data, bridging the gap for a unified Walmart experience whether shopping in-store or online
- **Enhanced Privacy Protection** - Social proof generated using contact list data with all friend identities remaining anonymous
- **Comprehensive Product Intelligence** - Detailed product information, authentic reviews, and live community discussions for confident purchase decisions

### 🌱 **Sustainability - Greener Cart Gamification**
**Solving Walmart's sustainability challenge through engagement**

- **Greener Cart System** - Earn "green points" for adding sustainable products to your cart, turning eco-friendly shopping into a rewarding, gamified experience
- **Eco-Score Display** - Every product shows clear sustainability ratings (carbon footprint, recyclability) for environmentally conscious choices at the point of decision
- **Personal & Community Impact Tracking** - Visualize individual and collective environmental impact through progress dashboards and community achievements
- **Corporate Influence Engine** - Drive demand for sustainable products, encouraging brands and suppliers to prioritize eco-friendly practices
- **Engagement & Rewards** - Badges, leaderboards, and shareable achievements boost ongoing user engagement and foster accomplishment for sustainable actions

### 🤖 **AI-Powered Assistant**
- **Intelligent Shopping Companion** - AI-driven product recommendations and natural language queries
- **Smart Decision Support** - Contextual suggestions based on social proof and sustainability data

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

- **`/`** - Home page with social proof showcase and sustainability features
- **`/scanner`** - Main scanning interface with camera functionality and social validation
- **`/assistant`** - AI-powered shopping assistant with personalized recommendations
- **`/achievements`** - Gamified sustainability progress and social achievements
- **`/social`** - Community insights and trending products
- **`/sustainability`** - Environmental impact dashboard and greener cart tracking

## 🎯 Impact & Innovation

### **Social Trust Revolution**
- **Authentic Reviews** - Move beyond anonymous reviews to trusted friend recommendations
- **Privacy-First Approach** - Leverage social connections while maintaining complete anonymity
- **Community-Driven Decisions** - Hyper-local and peer-relevant product insights

### **Sustainability Leadership**
- **Gamified Green Shopping** - Transform eco-conscious shopping into an engaging experience
- **Supply Chain Influence** - Drive corporate sustainability through consumer demand
- **Measurable Impact** - Track individual and community environmental contributions

### **Omnichannel Excellence**
- **Unified Experience** - Seamless integration between online and offline shopping
- **Real-Time Intelligence** - Instant access to social proof and sustainability data
- **Future-Ready Platform** - Scalable architecture for evolving retail needs

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

---

**Together, these features make Walmart SmartScan Pro a leader in combining social trust and sustainability, delivering an omnichannel, future-ready shopping experience.**

**Built with ❤️ for the future of retail**
