"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Search, Star, TrendingUp, Users, MapPin, Heart, Zap, FileImage, CheckCircle, AlertCircle } from "lucide-react"
import { CameraScanner } from "./camera/camera-scanner-backup-fixed"

function ScannerContent() {
  const [isScanning, setIsScanning] = useState(false)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  // Local storage functions
  const saveImageToStorage = (imageData: string, productData: Product) => {
    try {
      const savedImages = JSON.parse(localStorage.getItem('scanned-images') || '[]')
      const newScan = {
        id: Date.now().toString(),
        imageData,
        productData,
        timestamp: new Date().toISOString()
      }
      savedImages.push(newScan)
      localStorage.setItem('scanned-images', JSON.stringify(savedImages))
    } catch (error) {
      console.error('Failed to save image to storage:', error)
    }
  }

  const getSavedImages = () => {
    try {
      return JSON.parse(localStorage.getItem('scanned-images') || '[]')
    } catch (error) {
      console.error('Failed to get saved images:', error)
      return []
    }
  }

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setUploadedImage(imageData)
      processUploadedImage(imageData)
    }
    reader.readAsDataURL(file)
  }

  const processUploadedImage = async (imageData: string) => {
    setIsProcessingImage(true)
    setProcessingStep("Analyzing image...")

    // Simulate AI image processing steps
    const steps = [
      { text: "Analyzing image quality...", duration: 800 },
      { text: "Detecting products...", duration: 1200 },
      { text: "Identifying barcode/text...", duration: 1000 },
      { text: "Matching with database...", duration: 1500 },
      { text: "Gathering social proof...", duration: 1000 },
      { text: "Finalizing results...", duration: 500 }
    ]

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i].text)
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
    }

    // Generate mock product data
    const mockProduct: Product = {
      id: `uploaded-${Date.now()}`,
      name: "Great Value Organic Honey",
      price: "$4.98",
      rating: 4.5,
      reviews: 1247,
      image: imageData,
      socialProof: {
        friendsPurchased: Math.floor(Math.random() * 10) + 1,
        friendsRecommend: Math.floor(Math.random() * 30) + 70,
        locationPopularity: Math.floor(Math.random() * 20) + 60,
        userClassPreference: Math.floor(Math.random() * 20) + 80,
        trendingScore: Math.floor(Math.random() * 30) + 70,
        recentActivity: `${Math.floor(Math.random() * 200) + 50} people scanned this in the last hour`,
      },
      friends: [
        { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
        { name: "Mike R.", avatar: "/placeholder.svg?height=32&width=32", action: "recommended", timeAgo: "1 week ago" },
        { name: "Sarah L.", avatar: "/placeholder.svg?height=32&width=32", action: "reviewed", timeAgo: "3 days ago" },
      ],
    }

    // Save to local storage
    saveImageToStorage(imageData, mockProduct)

    setScannedProduct(mockProduct)
    setIsProcessingImage(false)
    setProcessingStep("")
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

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
            ) : isProcessingImage ? (
              <div className="space-y-6">
                {/* Image Processing Animation */}
                {uploadedImage && (
                  <div className="relative inline-block">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded product" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto border-4 border-blue-200"
                    />
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse"></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
                
                {/* Processing Steps Animation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mx-auto max-w-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-blue-800 font-medium">{processingStep}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">AI is analyzing your image and gathering social proof data...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Camera className="w-16 h-16 text-gray-400" />
                  <div className="text-4xl text-gray-300">or</div>
                  <FileImage className="w-16 h-16 text-gray-400" />
                </div>
                
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
                    
                    <Button onClick={handleUploadClick} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    
                    <Button onClick={simulateTraditionalScan} variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Scan Demo
                    </Button>
                  </div>
                  
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Supported formats: JPG, PNG, WebP (max 10MB)</p>
                    <p className="flex items-center justify-center mt-1">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Images are processed locally and stored in your browser
                    </p>
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

      {/* Saved Images Section */}
      {getSavedImages().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileImage className="w-5 h-5" />
              <span>Recently Scanned Images</span>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {getSavedImages().length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getSavedImages().slice(0, 8).map((scan: any) => (
                <div 
                  key={scan.id} 
                  className="group relative bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setScannedProduct(scan.productData)}
                >
                  <img 
                    src={scan.imageData} 
                    alt="Scanned product" 
                    className="w-full h-20 object-cover rounded-md mb-2"
                  />
                  <div className="text-xs text-gray-600 truncate">
                    {scan.productData.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">View Details</span>
                  </div>
                </div>
              ))}
            </div>
            
            {getSavedImages().length > 8 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All {getSavedImages().length} Images
                </Button>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Images are stored locally in your browser</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  localStorage.removeItem('scanned-images')
                  window.location.reload()
                }}
              >
                Clear All
              </Button>
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
