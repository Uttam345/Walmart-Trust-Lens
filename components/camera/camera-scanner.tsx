"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  X,
  Camera,
  FlashlightOffIcon as FlashOff,
  FlashlightIcon as Flash,
  RotateCcw,
  Zap,
  CheckCircle,
  Scan,
  Search,
  AlertCircle,
} from "lucide-react"

interface CameraScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (productData: any) => void
}

export function CameraScanner({ isOpen, onClose, onScanComplete }: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanningState, setScanningState] = useState<"idle" | "scanning" | "processing" | "success" | "not_found">(
    "idle",
  )
  const [detectedProduct, setDetectedProduct] = useState<any>(null)
  const [detectedCode, setDetectedCode] = useState<string | null>(null)
  const [scanType, setScanType] = useState<"barcode" | "qr" | "product" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isQuaggaInitialized, setIsQuaggaInitialized] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Enhanced mock product database with barcodes and QR codes
  const mockProducts = [
    {
      id: "honey123",
      name: "Great Value Organic Honey",
      price: "$4.98",
      rating: 4.8,
      reviews: 2847,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "123456789012",
      qrCode: "walmart://product/honey123",
      upc: "012345678901",
      socialProof: {
        friendsPurchased: 3,
        friendsRecommend: 89,
        locationPopularity: 76,
        trendingScore: 85,
      },
    },
    {
      id: "detergent456",
      name: "Tide Ultra Concentrated Detergent",
      price: "$12.97",
      rating: 4.6,
      reviews: 5234,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "987654321098",
      qrCode: "walmart://product/detergent456",
      upc: "098765432109",
      socialProof: {
        friendsPurchased: 2,
        friendsRecommend: 94,
        locationPopularity: 82,
        trendingScore: 78,
      },
    },
    {
      id: "cereal789",
      name: "Cheerios Original Cereal",
      price: "$5.48",
      rating: 4.7,
      reviews: 3456,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "456789123456",
      qrCode: "walmart://product/cereal789",
      upc: "045678912345",
      socialProof: {
        friendsPurchased: 4,
        friendsRecommend: 91,
        locationPopularity: 88,
        trendingScore: 82,
      },
    },
    {
      id: "milk101",
      name: "Great Value 2% Milk",
      price: "$3.28",
      rating: 4.5,
      reviews: 1892,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "789123456789",
      qrCode: "walmart://product/milk101",
      upc: "078912345678",
      socialProof: {
        friendsPurchased: 5,
        friendsRecommend: 87,
        locationPopularity: 94,
        trendingScore: 75,
      },
    },
  ]

  const addDebugInfo = (info: string) => {
    console.log("Scanner Debug:", info)
    setDebugInfo((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`])
  }

  // Generate a mock product for unknown barcodes
  const generateMockProduct = (barcode: string) => {
    const productNames = ["Unknown Product", "Scanned Item", "Walmart Product", "Store Brand Item", "Generic Product"]

    const randomName = productNames[Math.floor(Math.random() * productNames.length)]
    const randomPrice = (Math.random() * 20 + 2).toFixed(2)
    const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1)
    const randomReviews = Math.floor(Math.random() * 5000 + 100)

    return {
      id: `unknown_${barcode}`,
      name: `${randomName} (${barcode.slice(-6)})`,
      price: `$${randomPrice}`,
      rating: Number.parseFloat(randomRating),
      reviews: randomReviews,
      image: "/placeholder.svg?height=120&width=120",
      barcode: barcode,
      isUnknown: true,
      socialProof: {
        friendsPurchased: Math.floor(Math.random() * 3),
        friendsRecommend: Math.floor(Math.random() * 40 + 60),
        locationPopularity: Math.floor(Math.random() * 30 + 50),
        trendingScore: Math.floor(Math.random() * 50 + 30),
      },
    }
  }

  // Find product by barcode with flexible matching
  const findProductByBarcode = (code: string) => {
    addDebugInfo(`Looking for product with code: ${code}`)

    // First try exact match
    let product = mockProducts.find((p) => p.barcode === code || p.upc === code || p.qrCode === code)

    if (product) {
      addDebugInfo(`Found exact match: ${product.name}`)
      return product
    }

    // Try partial matches (last 6-8 digits)
    const codeEnd = code.slice(-6)
    product = mockProducts.find((p) => p.barcode.includes(codeEnd) || p.upc.includes(codeEnd))

    if (product) {
      addDebugInfo(`Found partial match: ${product.name}`)
      return product
    }

    // If no match found, generate a mock product
    addDebugInfo(`No match found, generating mock product`)
    return generateMockProduct(code)
  }

  // Real barcode detection using QuaggaJS
  const initializeBarcodeScanner = async () => {
    if (!videoRef.current) {
      addDebugInfo("No video element available")
      return
    }

    try {
      addDebugInfo("Initializing QuaggaJS...")
      // Dynamic import of QuaggaJS
      const Quagga = (await import("quagga")).default

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: 2,
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
              "codabar_reader",
            ],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            addDebugInfo(`QuaggaJS init failed: ${err.message}`)
            console.error("QuaggaJS initialization failed:", err)
            // Fallback to mock scanning
            startMockScanning()
            return
          }
          addDebugInfo("QuaggaJS initialized successfully")
          setIsQuaggaInitialized(true)
          Quagga.start()
        },
      )

      // Listen for barcode detection
      Quagga.onDetected((data) => {
        const code = data.codeResult.code
        addDebugInfo(`Barcode detected: ${code}`)

        // Find product by barcode (now with flexible matching)
        const product = findProductByBarcode(code)

        setDetectedCode(code)
        setScanType("barcode")
        setScanningState("processing")

        stopBarcodeScanner()

        setTimeout(() => {
          setDetectedProduct(product)
          setScanningState("success")
          setScanProgress(100)
        }, 1000)
      })

      // Listen for processing events
      Quagga.onProcessed((result) => {
        if (result && result.codeResult) {
          addDebugInfo(`Processing barcode: ${result.codeResult.code}`)
        }
      })
    } catch (error) {
      addDebugInfo(`Failed to load QuaggaJS: ${error.message}`)
      console.error("Failed to load QuaggaJS:", error)
      // Fallback to mock scanning
      startMockScanning()
    }
  }

  const stopBarcodeScanner = async () => {
    try {
      if (isQuaggaInitialized) {
        addDebugInfo("Stopping QuaggaJS...")
        const Quagga = (await import("quagga")).default
        if (Quagga && typeof Quagga.stop === "function") {
          Quagga.stop()
          setIsQuaggaInitialized(false)
          addDebugInfo("QuaggaJS stopped")
        }
      }
    } catch (error) {
      addDebugInfo(`Error stopping QuaggaJS: ${error.message}`)
      console.error("Error stopping QuaggaJS:", error)
    }
  }

  const startMockScanning = () => {
    addDebugInfo("Using mock barcode scanning")

    // Simulate barcode detection after 3 seconds
    setTimeout(() => {
      // Generate a random barcode for demo
      const randomBarcode = Math.floor(Math.random() * 900000000000 + 100000000000).toString()
      const product = findProductByBarcode(randomBarcode)

      setDetectedCode(randomBarcode)
      setScanType("barcode")
      setScanningState("processing")

      setTimeout(() => {
        setDetectedProduct(product)
        setScanningState("success")
        setScanProgress(100)
      }, 1000)
    }, 3000)
  }

  // Initialize camera when component opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera()
    } else {
      cleanup()
    }

    return () => cleanup()
  }, [isOpen])

  const initializeCamera = async () => {
    try {
      addDebugInfo("Requesting camera access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        addDebugInfo("Camera access granted")
      }
    } catch (error) {
      addDebugInfo(`Camera access denied: ${error.message}`)
      console.error("Camera access denied:", error)
      setHasPermission(false)
    }
  }

  const cleanup = async () => {
    addDebugInfo("Cleaning up scanner...")
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }
    await stopBarcodeScanner()
    setScanningState("idle")
    setScanProgress(0)
    setDetectedProduct(null)
    setDetectedCode(null)
    setScanType(null)
  }

  const startScanning = async () => {
    addDebugInfo("Starting scan...")
    setIsScanning(true)
    setScanningState("scanning")
    setScanProgress(0)
    setDetectedCode(null)
    setScanType(null)

    // Try to initialize real barcode scanner
    await initializeBarcodeScanner()

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 100)

    // Fallback timeout if no barcode detected
    scanTimeoutRef.current = setTimeout(async () => {
      addDebugInfo("Scan timeout reached, falling back to product recognition")
      clearInterval(progressInterval)
      await stopBarcodeScanner()

      // If no barcode detected, simulate product recognition
      setScanType("product")
      setScanningState("processing")

      setTimeout(() => {
        const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
        setDetectedProduct(randomProduct)
        setScanningState("success")
        setScanProgress(100)
      }, 1000)
    }, 15000) // Increased timeout for better real scanning
  }

  const stopScanning = async () => {
    addDebugInfo("Stopping scan...")
    setIsScanning(false)
    setScanningState("idle")
    setScanProgress(0)
    await stopBarcodeScanner()
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }
  }

  const handleScanComplete = () => {
    if (detectedProduct) {
      onScanComplete({
        ...detectedProduct,
        scanMethod: scanType,
        detectedCode: detectedCode,
        scanTimestamp: new Date().toISOString(),
      })
      onClose()
    }
  }

  const handleSearchProduct = () => {
    if (detectedCode) {
      // Simulate searching for the product online
      setScanningState("processing")
      setTimeout(() => {
        const searchProduct = {
          id: `search_${detectedCode}`,
          name: `Product Search Result (${detectedCode})`,
          price: "$0.00",
          rating: 0,
          reviews: 0,
          image: "/placeholder.svg?height=120&width=120",
          barcode: detectedCode,
          isSearchResult: true,
          socialProof: {
            friendsPurchased: 0,
            friendsRecommend: 0,
            locationPopularity: 0,
            trendingScore: 0,
          },
        }
        setDetectedProduct(searchProduct)
        setScanningState("success")
      }, 1500)
    }
  }

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled)
    // In a real implementation, this would control the camera flash
  }

  const retryScanning = () => {
    setDetectedProduct(null)
    setDetectedCode(null)
    setScanType(null)
    setScanningState("idle")
    setScanProgress(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Header */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <h2 className="text-white font-semibold">Smart Product Scanner</h2>
            <p className="text-white/80 text-sm">
              {scanningState === "scanning" ? "Scanning for codes..." : "Point camera at barcode, QR code, or product"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={toggleFlash} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              {flashEnabled ? <Flash className="w-5 h-5" /> : <FlashOff className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="px-4 pb-2">
            <details className="text-white/60 text-xs">
              <summary className="cursor-pointer">Debug Info</summary>
              <div className="mt-1 space-y-1">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {hasPermission === false ? (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <Card className="m-4">
              <CardContent className="p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
                <p className="text-gray-600 mb-4">Please allow camera access to scan products</p>
                <Button onClick={initializeCamera} className="bg-blue-600 hover:bg-blue-700">
                  Enable Camera
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Scanning Frame */}
              <div className="relative">
                <div
                  className={`w-64 h-64 border-2 rounded-lg transition-all duration-300 ${
                    scanningState === "success"
                      ? "border-green-400"
                      : scanningState === "scanning"
                        ? "border-blue-400"
                        : scanningState === "not_found"
                          ? "border-orange-400"
                          : "border-white"
                  }`}
                >
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>

                  {/* Scanning line animation */}
                  {scanningState === "scanning" && (
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div
                        className="absolute w-full h-1 bg-blue-400 animate-pulse"
                        style={{
                          top: `${(scanProgress / 100) * 100}%`,
                          boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                        }}
                      ></div>

                      {/* Code detection indicators */}
                      <div className="absolute inset-4 border border-blue-300 rounded opacity-50">
                        <Scan className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Success checkmark */}
                  {scanningState === "success" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Not found indicator */}
                  {scanningState === "not_found" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Instruction text */}
                <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 text-center w-80">
                  <p className="text-white text-sm bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
                    {scanningState === "idle" && "Align barcode, QR code, or product within frame"}
                    {scanningState === "scanning" && scanType && `Detecting ${scanType}...`}
                    {scanningState === "scanning" && !scanType && "Scanning for codes..."}
                    {scanningState === "processing" && "Processing product data..."}
                    {scanningState === "success" && `${scanType || "Product"} detected!`}
                    {scanningState === "not_found" && "Product not found in database"}
                  </p>

                  {detectedCode && (
                    <p className="text-white/80 text-xs mt-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      Code: {detectedCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            {(scanningState === "scanning" || scanningState === "processing") && (
              <div className="absolute bottom-32 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm mb-1">
                        {scanningState === "scanning" && !scanType && "Scanning for barcodes and QR codes..."}
                        {scanningState === "scanning" && scanType === "barcode" && "Reading barcode..."}
                        {scanningState === "scanning" && scanType === "qr" && "Reading QR code..."}
                        {scanningState === "processing" && "Looking up product information..."}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product detected card */}
            {scanningState === "success" && detectedProduct && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card
                  className={`${detectedProduct.isUnknown ? "border-orange-400 bg-orange-50/95" : "border-green-400 bg-white/95"} backdrop-blur-sm`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={detectedProduct.image || "/placeholder.svg"}
                        alt={detectedProduct.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{detectedProduct.name}</h4>
                        <p
                          className={`text-lg font-bold ${detectedProduct.isUnknown ? "text-orange-600" : "text-green-600"}`}
                        >
                          {detectedProduct.price}
                        </p>
                        {scanType && (
                          <p className="text-xs text-gray-500 capitalize">
                            Detected via {scanType} {detectedCode && `(${detectedCode.slice(-6)})`}
                          </p>
                        )}
                        {detectedProduct.isUnknown && (
                          <p className="text-xs text-orange-600 font-medium">Product not in database</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-sm">{detectedProduct.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600">{detectedProduct.reviews} reviews</p>
                      </div>
                    </div>

                    {/* Quick social proof */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div
                        className={`${detectedProduct.isUnknown ? "bg-orange-50" : "bg-blue-50"} rounded p-2 text-center`}
                      >
                        <div
                          className={`font-semibold ${detectedProduct.isUnknown ? "text-orange-600" : "text-blue-600"}`}
                        >
                          {detectedProduct.socialProof.friendsRecommend}%
                        </div>
                        <div className={`${detectedProduct.isUnknown ? "text-orange-700" : "text-blue-700"}`}>
                          Friends recommend
                        </div>
                      </div>
                      <div
                        className={`${detectedProduct.isUnknown ? "bg-orange-50" : "bg-green-50"} rounded p-2 text-center`}
                      >
                        <div
                          className={`font-semibold ${detectedProduct.isUnknown ? "text-orange-600" : "text-green-600"}`}
                        >
                          {detectedProduct.socialProof.locationPopularity}%
                        </div>
                        <div className={`${detectedProduct.isUnknown ? "text-orange-700" : "text-green-700"}`}>
                          Local popularity
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {detectedProduct.isUnknown ? (
                        <>
                          <Button onClick={handleSearchProduct} className="flex-1 bg-orange-600 hover:bg-orange-700">
                            <Search className="w-4 h-4 mr-2" />
                            Search Online
                          </Button>
                          <Button onClick={retryScanning} variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={handleScanComplete} className="flex-1 bg-green-600 hover:bg-green-700">
                            <Zap className="w-4 h-4 mr-2" />
                            View Social Proof
                          </Button>
                          <Button onClick={retryScanning} variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Controls */}
      {hasPermission && scanningState === "idle" && (
        <div className="relative z-10 bg-black/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-center space-x-8">
            <Button onClick={onClose} variant="ghost" size="lg" className="text-white hover:bg-white/20">
              Cancel
            </Button>
            <Button
              onClick={startScanning}
              size="lg"
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
            >
              <Camera className="w-8 h-8" />
            </Button>
            <div className="w-16"></div> {/* Spacer for symmetry */}
          </div>

          <p className="text-center text-white/80 text-sm mt-4">Tap to scan barcodes, QR codes, or product images</p>
        </div>
      )}

      {/* Scanning controls */}
      {scanningState === "scanning" && (
        <div className="relative z-10 bg-black/50 backdrop-blur-sm p-6">
          <div className="flex justify-center">
            <Button onClick={stopScanning} variant="outline" className="border-white text-white hover:bg-white/20">
              Stop Scanning
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
