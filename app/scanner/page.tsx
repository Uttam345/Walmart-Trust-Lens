import { Header } from "@/components/header"
import { RecentScans } from "@/components/recent-scans"
import SocialProofScanner from "@/components/social-proof-scanner"
import { Scan, QrCode, Camera, Sparkles, TrendingUp, Users } from "lucide-react"

export default function ScannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Scan className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Proof Scanner
              </h1>
              <p className="text-gray-600 text-lg">Powered by AI & Social Intelligence</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Scan any product to instantly discover real reviews, social proof, and smart recommendations 
            from your community and similar shoppers. <span className="font-semibold text-blue-600">Now powered by AI image analysis!</span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Universal Scanning</h3>
            <p className="text-gray-600 text-sm">Scan barcodes of any product for instant analysis</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Proof</h3>
            <p className="text-gray-600 text-sm">See what people in your network and similar demographics are buying</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600 text-sm">Scan any product barcode and get detailed analysis, features, buying tips, and price comparisons powered by Gemini-AI</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Social Proof Scanner Component */}
            <SocialProofScanner />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Today's Scanning Activity
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">250</div>
                  <div className="text-sm text-gray-600">Products Scanned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">90%</div>
                  <div className="text-sm text-gray-600">Match Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">1.5k</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <RecentScans />
            
            {/* Quick Actions
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Scan with Camera</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-medium">Enter Barcode</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Browse Popular</span>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
