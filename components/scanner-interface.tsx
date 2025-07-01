"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Search, Star, TrendingUp, Users } from "lucide-react"
import { CameraScanner } from "./camera/camera-scanner-backup-fixed"

interface SocialProof {
  friendsPurchased?: number
  friendsRecommend?: number
  locationPopularity?: number
  trendingScore?: number
  recentActivity?: string
}

interface ScannedProduct {
  id: string
  name: string
  price: string
  rating?: number
  reviews?: number
  image?: string
  socialProof?: SocialProof
}

export function ScannerInterface() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleScan = () => {
    setShowCamera(true)
  }

  const handleCameraClose = () => {
    setShowCamera(false)
  }

  const handleScanComplete = (productData: any) => {
    setScannedProduct({
      ...productData,
      socialProof: {
        friendsPurchased: productData.socialProof?.friendsPurchased || 0,
        friendsRecommend: productData.socialProof?.friendsRecommend || 0,
        locationPopularity: productData.socialProof?.locationPopularity || 0,
        trendingScore: productData.socialProof?.trendingScore || 0,
        recentActivity: "Just scanned - analyzing social proof...",
      },
    })
    setShowCamera(false)
  }

  const simulateTraditionalScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setScannedProduct({
        id: "honey123",
        name: "Great Value Organic Honey",
        price: "$4.98",
        rating: 4.5,
        reviews: 1247,
        image: "/placeholder.svg?height=200&width=200",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Scan Product</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {isScanning ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Scanning product...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scan or Upload Product</h3>
                  <p className="text-gray-600 mb-6">Point your camera at a product or upload an image</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                    <Button onClick={simulateTraditionalScan} variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Search Product
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {scannedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Social Proof Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <img
                src={scannedProduct.image || "/placeholder.svg"}
                alt={scannedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{scannedProduct.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{scannedProduct.price}</p>

                {/* Enhanced Social Proof Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{scannedProduct.rating}</span>
                    <span className="text-gray-600">({scannedProduct.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-600 font-medium">89% recommend</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">Trending +23%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 text-sm">47 scanned today</span>
                  </div>
                </div>

                {/* Community Insights */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">Community Insight</p>
                  <p className="text-sm text-blue-700">
                    "Most popular organic honey choice - great value for quality!"
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">View Full Social Analysis</Button>
                  <Button variant="outline">Join Community Discussion</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Scanner Modal */}
      <CameraScanner isOpen={showCamera} onClose={handleCameraClose} onScanComplete={handleScanComplete} />
    </div>
  )
}
