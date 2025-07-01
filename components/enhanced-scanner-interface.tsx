"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Search, Star, TrendingUp, Users, MapPin, Heart, Zap } from "lucide-react"
import { CameraScanner } from "./camera/camera-scanner-backup-fixed"

function ScannerContent() {
  const [isScanning, setIsScanning] = useState(false)
  type Friend = {
    name: string
    avatar: string
    action: string
    timeAgo: string
  }

  type SocialProof = {
    friendsPurchased: number
    friendsRecommend: number
    locationPopularity: number
    userClassPreference: number
    trendingScore: number
    recentActivity: string
  }

  type Product = {
    id: string
    name: string
    price: string
    rating: number
    reviews: number
    image: string
    socialProof: SocialProof
    friends: Friend[]
  }

  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const searchParams = useSearchParams()
  const productId = searchParams?.get("product")
  const searchQuery = searchParams?.get("q")

  // Load product if coming from search
  useEffect(() => {
    if (productId) {
      // Simulate loading product data
      setScannedProduct({
        id: productId,
        name: "Great Value Organic Honey",
        price: "$4.98",
        rating: 4.5,
        reviews: 1247,
        image: "/placeholder.svg?height=200&width=200",
        socialProof: {
          friendsPurchased: 3,
          friendsRecommend: 89,
          locationPopularity: 76,
          userClassPreference: 92,
          trendingScore: 85,
          recentActivity: "127 people scanned this in the last hour",
        },
        friends: [
          { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
          {
            name: "Mike R.",
            avatar: "/placeholder.svg?height=32&width=32",
            action: "recommended",
            timeAgo: "1 week ago",
          },
          {
            name: "Sarah L.",
            avatar: "/placeholder.svg?height=32&width=32",
            action: "reviewed",
            timeAgo: "3 days ago",
          },
        ],
      })
    }
  }, [productId])

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
        userClassPreference: 92,
        trendingScore: productData.socialProof?.trendingScore || 0,
        recentActivity: "Just scanned - analyzing social proof...",
      },
      friends: [
        { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
        {
          name: "Mike R.",
          avatar: "/placeholder.svg?height=32&width=32",
          action: "recommended",
          timeAgo: "1 week ago",
        },
        {
          name: "Sarah L.",
          avatar: "/placeholder.svg?height=32&width=32",
          action: "reviewed",
          timeAgo: "3 days ago",
        },
      ],
    })
    setShowCamera(false)
  }

  const simulateTraditionalScan = () => {
    setIsScanning(true)

    // Simulate barcode detection animation
    setTimeout(() => {
      setIsScanning(false)
      setScannedProduct({
        id: "honey123",
        name: "Great Value Organic Honey",
        price: "$4.98",
        rating: 4.5,
        reviews: 1247,
        image: "/placeholder.svg?height=200&width=200",
        socialProof: {
          friendsPurchased: 3,
          friendsRecommend: 89,
          locationPopularity: 76,
          userClassPreference: 92,
          trendingScore: 85,
          recentActivity: "127 people scanned this in the last hour",
        },
        friends: [
          { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
          {
            name: "Mike R.",
            avatar: "/placeholder.svg?height=32&width=32",
            action: "recommended",
            timeAgo: "1 week ago",
          },
          {
            name: "Sarah L.",
            avatar: "/placeholder.svg?height=32&width=32",
            action: "reviewed",
            timeAgo: "3 days ago",
          },
        ],
      })
    }, 3000) // Increased to 3 seconds for barcode animation
  }

  return (
    <div className="space-y-6">
      {searchQuery && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">
                Search results for: <strong>"{searchQuery}"</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Social Proof Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {isScanning ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  {/* Barcode scanning animation */}
                  <div className="w-32 h-20 border-2 border-blue-400 rounded mx-auto mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-pulse"></div>
                    <div className="absolute top-2 left-2 right-2 space-y-1">
                      <div className="h-1 bg-gray-800 rounded"></div>
                      <div className="h-1 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-1 bg-gray-800 rounded w-1/2"></div>
                      <div className="h-1 bg-gray-800 rounded w-5/6"></div>
                      <div className="h-1 bg-gray-800 rounded w-2/3"></div>
                    </div>
                    <div className="absolute inset-0 border-2 border-red-500 animate-ping opacity-75"></div>
                  </div>
                </div>
                <p className="text-gray-600">Scanning barcode and analyzing social proof...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scan or Upload Product</h3>
                  <p className="text-gray-600 mb-6">
                    Get instant social proof from friends, neighbors, and similar shoppers
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera Scanner
                    </Button>
                    <Button onClick={simulateTraditionalScan} variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Scan Demo
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
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
            <CardTitle>Complete Social Proof Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Product Overview */}
              <div className="flex items-start space-x-4">
                <img
                  src={scannedProduct.image || "/placeholder.svg"}
                  alt={scannedProduct.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{scannedProduct.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{scannedProduct.price}</p>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{scannedProduct.rating}</span>
                    <span className="text-gray-600">({scannedProduct.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Friends' Activity */}
              {scannedProduct.friends && scannedProduct.friends.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Your Friends' Activity
                  </h4>
                  <div className="space-y-2">
                    {scannedProduct.friends.map((friend, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {friend.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="text-sm">
                            <strong>{friend.name}</strong> {friend.action} this product {friend.timeAgo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Proof Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="font-semibold text-green-600">{scannedProduct.socialProof.friendsRecommend}%</div>
                  <div className="text-xs text-gray-600">Friends recommend</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="font-semibold text-blue-600">{scannedProduct.socialProof.locationPopularity}%</div>
                  <div className="text-xs text-gray-600">Local popularity</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="font-semibold text-purple-600">{scannedProduct.socialProof.trendingScore}%</div>
                  <div className="text-xs text-gray-600">Trending score</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <div className="font-semibold text-yellow-600">{scannedProduct.socialProof.userClassPreference}%</div>
                  <div className="text-xs text-gray-600">Similar users like</div>
                </div>
              </div>

              {/* Real-time Activity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Live Activity</span>
                </div>
                <p className="text-gray-700">{scannedProduct.socialProof.recentActivity}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link href={`/social?product=${scannedProduct.id}`} className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    View Community Discussion
                  </Button>
                </Link>
                <Link href={`/sustainability?product=${scannedProduct.id}`}>
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Check Sustainability
                  </Button>
                </Link>
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

function ScannerFallback() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Social Proof Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="space-y-4">
              <Camera className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Scanner...</h3>
                <p className="text-gray-600">Please wait while we initialize the scanner</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function EnhancedScannerInterface() {
  return (
    <Suspense fallback={<ScannerFallback />}>
      <ScannerContent />
    </Suspense>
  )
}
