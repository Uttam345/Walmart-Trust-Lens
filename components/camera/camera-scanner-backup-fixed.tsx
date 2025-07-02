/**
 * Enhanced Camera Scanner with Robust Fallback Mechanism
 * 
 * Features:
 * - Real barcode/QR code detection using ZXing library
 * - Automatic fallback to demo product if:
 *   - ZXing library fails to compile/initialize
 *   - No barcode detected within 15 seconds
 *   - Camera permission denied
 * - Comprehensive resource cleanup (camera, scanner, timeouts)
 * - Debug information panel for troubleshooting
 * - Support for multiple barcode formats and product recognition
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { lookupBarcode, type ProcessedProduct } from "@/lib/barcode-api"
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
  onScanComplete: (productData: ProcessedProduct) => void
}

export function CameraScanner({ isOpen, onClose, onScanComplete }: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanningState, setScanningState] = useState<"idle" | "scanning" | "processing" | "success" | "not_found">(
    "idle",
  )
  const [detectedProduct, setDetectedProduct] = useState<ProcessedProduct | null>(null)
  const [detectedCode, setDetectedCode] = useState<string | null>(null)
  const [scanType, setScanType] = useState<"barcode" | "qr" | "product" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isQuaggaInitialized, setIsQuaggaInitialized] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const codeReaderRef = useRef<any>(null)

  const addDebugInfo = (info: string) => {
    console.log("Scanner Debug:", info)
    setDebugInfo((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`])
  }

  // Real barcode detection using ZXing
  const initializeBarcodeScanner = () => {
    if (!videoRef.current) {
      addDebugInfo("No video element available")
      return
    }

    const setupScanner = async () => {
      try {
        addDebugInfo("Initializing ZXing scanner...")
        // Dynamic import of ZXing
        const { BrowserMultiFormatReader } = await import("@zxing/library")
        
        const codeReader = new BrowserMultiFormatReader()
        codeReaderRef.current = codeReader
        
        // Set up progress animation
        const progressInterval = setInterval(() => {
          setScanProgress((prev) => {
            if (prev >= 85) {
              return 90
            }
            return prev + 5
          })
        }, 100)

        // Set up timeout fallback - same as the other scanner
        scanTimeoutRef.current = setTimeout(() => {
          addDebugInfo("⏰ ZXing scan timeout reached, no product found")
          clearInterval(progressInterval)
          stopBarcodeScanner()
          setScanType("product")
          setScanningState("not_found")
          setDetectedProduct(null)
          setScanProgress(100)
        }, 15000) // 15 second timeout to match the existing timeout
        
        // Start continuous scanning
        const scannerPromise = codeReader.decodeFromVideoDevice(null, videoRef.current!, async (result, error) => {
          if (result) {
            const code = result.getText()
            addDebugInfo(`✅ Barcode detected: ${code}`)

            // Clear timeout and progress since we found a barcode
            if (scanTimeoutRef.current) {
              clearTimeout(scanTimeoutRef.current)
              scanTimeoutRef.current = null
            }
            clearInterval(progressInterval)

            setDetectedCode(code)
            setScanType("barcode")
            setScanningState("processing")

            // --- API lookup logic ---
            let product: ProcessedProduct | null = null
            try {
              product = await lookupBarcode(code)
              addDebugInfo(`API returned: ${JSON.stringify(product)}`)
            } catch (e) {
              addDebugInfo(`Barcode API error: ${e instanceof Error ? e.message : String(e)}`)
            }
            setTimeout(() => {
              // Defensive: ensure product is not undefined and has at least a name or image
              if (product && (product.name || product.image)) {
                setDetectedProduct({
                  ...product,
                  name: product.name || "Unknown Product",
                  image: product.image || "/placeholder.svg",
                  price: product.price || "N/A",
                  rating: product.rating ?? 0,
                  reviews: product.reviews ?? 0,
                  category: product.category || "",
                  brand: product.brand || "",
                  manufacturer: product.manufacturer || "",
                  description: product.description || "",
                  features: product.features || [],
                  stores: product.stores || [],
                  socialProof: product.socialProof || undefined,
                })
                setScanningState("success")
              } else {
                setDetectedProduct(null)
                setScanningState("not_found")
              }
              setScanProgress(100)
            }, 1000)

            // Stop the scanner after successful detection
            stopBarcodeScanner()
          } else if (error && error.name !== 'NotFoundException') {
            // Only log non-NotFoundException errors (NotFoundException is normal when no barcode is visible)
            addDebugInfo(`ZXing scan error: ${error.message}`)
          }
        })
        
        addDebugInfo("✨ ZXing scanner started successfully")
        
      } catch (error) {
        addDebugInfo(`❌ Failed to initialize ZXing: ${error instanceof Error ? error.message : String(error)}`)
        console.error("Failed to initialize ZXing:", error)
      }
    }
    
    setupScanner()
  }

  const stopBarcodeScanner = () => {
    try {
      addDebugInfo("🛑 Stopping ZXing scanner...")
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
        addDebugInfo("✅ ZXing scanner reset successfully")
        codeReaderRef.current = null
      }
      setIsQuaggaInitialized(false)
      addDebugInfo("✨ ZXing scanner stopped")
    } catch (error) {
      addDebugInfo(`Error stopping ZXing: ${error instanceof Error ? error.message : String(error)}`)
      console.error("Error stopping ZXing:", error)
    }
  }

  const initializeCamera = async () => {
    try {
      addDebugInfo("🎥 Requesting camera permission...")
      
      // Check if camera is already in use
      if (streamRef.current) {
        addDebugInfo("Camera already initialized, cleaning up first...")
        stopCamera()
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use rear camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        addDebugInfo("✅ Camera initialized successfully")
        
        // Add event listener for when video metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          addDebugInfo("📹 Video metadata loaded")
        }
        
        // Add event listener for video errors
        videoRef.current.onerror = (error) => {
          addDebugInfo(`❌ Video error: ${error}`)
          cleanupEverything()
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addDebugInfo(`❌ Camera error: ${errorMessage}`)
      setHasPermission(false)
      
      // Clean up any partial initialization
      stopCamera()
    }
  }

  const stopCamera = () => {
    addDebugInfo("🛑 Stopping camera...")
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => {
        track.stop()
        addDebugInfo(`✅ Stopped ${track.kind} track (state: ${track.readyState})`)
      })
      streamRef.current = null
      addDebugInfo("📹 Camera stream cleared")
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      addDebugInfo("🎥 Video element cleared")
    }
    setHasPermission(null)
    addDebugInfo("✨ Camera cleanup completed")
  }

  const cleanupEverything = () => {
    addDebugInfo("🧹 Cleaning up all resources...")
    stopCamera()
    stopBarcodeScanner()
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
      scanTimeoutRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsScanning(false)
    setScanningState("idle")
    setScanProgress(0)
    setDetectedProduct(null)
    setDetectedCode(null)
    setScanType(null)
  }

  const handleClose = () => {
    addDebugInfo("🚪 Handling modal close...")
    cleanupEverything()
    onClose()
  }

  const startScanning = () => {
    addDebugInfo("🚀 Starting scan...")
    setIsScanning(true)
    setScanningState("scanning")
    setScanProgress(0)
    setDetectedCode(null)
    setScanType(null)

    // Try to initialize real barcode scanner
    initializeBarcodeScanner()

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
    scanTimeoutRef.current = setTimeout(() => {
      addDebugInfo("⏰ Scan timeout reached, falling back to product recognition")
      clearInterval(progressInterval)
      stopBarcodeScanner()

      // If no barcode detected, simulate product recognition
      setScanType("product")
      setScanningState("processing")

      setTimeout(() => {
        // No mockProducts, just set not found
        setDetectedCode(null)
        setScanType("barcode")
        setScanningState("not_found")
        setDetectedProduct(null)
        setScanProgress(100)
      }, 3000)
    }, 15000) // Increased timeout for better real scanning
  }

  const stopScanning = () => {
    addDebugInfo("⏹️ Stopping scan...")
    setIsScanning(false)
    setScanningState("idle")
    setScanProgress(0)
    stopBarcodeScanner()
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
      scanTimeoutRef.current = null
    }
    // Reset detected data
    setDetectedProduct(null)
    setDetectedCode(null)
    setScanType(null)
  }

  const handleScanComplete = () => {
    if (detectedProduct) {
      onScanComplete({
        ...detectedProduct,
        detectedCode: detectedCode || undefined,
        scanTimestamp: new Date().toISOString(),
      })
      cleanupEverything()
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
    addDebugInfo(`💡 Flash ${flashEnabled ? 'disabled' : 'enabled'}`)
    // In a real implementation, this would control the camera flash
  }

  const retryScanning = () => {
    addDebugInfo("🔄 Retrying scan...")
    setDetectedProduct(null)
    setDetectedCode(null)
    setScanType(null)
    setScanningState("idle")
    setScanProgress(0)
  }

  // Handle page visibility changes to stop camera when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isOpen) {
        addDebugInfo("👁️ Page hidden, cleaning up camera...")
        cleanupEverything()
      }
    }

    const handleBeforeUnload = () => {
      addDebugInfo("🚪 Page unloading, cleaning up camera...")
      cleanupEverything()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isOpen])

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    return () => {
      cleanupEverything()
    }
  }, [])

  // Initialize/cleanup camera based on modal state
  useEffect(() => {
    if (isOpen && hasPermission === null) {
      initializeCamera()
    } else if (!isOpen && hasPermission !== null) {
      // Modal closed, cleanup everything
      cleanupEverything()
    }
  }, [isOpen])

  // Cleanup when component receives new isOpen prop
  useEffect(() => {
    if (!isOpen) {
      cleanupEverything()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-blue-950/90 to-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanner Modal Container */}
      <div className="bg-white/95 dark:bg-black/95 rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl mx-auto flex flex-col md:flex-row md:h-[540px] relative">
        {/* Left: Camera & Overlay */}
        <div className="md:w-1/2 w-full flex flex-col bg-gradient-to-b from-gray-900/90 to-gray-800/80 relative">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md flex items-center justify-between p-4 border-b border-white/10">
            <Button onClick={handleClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
            <div className="text-center flex-1">
              <h2 className="text-white font-bold text-lg tracking-wide">Scanner</h2>
              <p className="text-white/80 text-xs">
                {scanningState === "scanning" ? "Scanning..." : "Scan barcode or QR code"}
              </p>
            </div>
            <Button onClick={toggleFlash} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              {flashEnabled ? <Flash className="w-4 h-4" /> : <FlashOff className="w-4 h-4" />}
            </Button>
          </div>

          {/* Camera View Container */}
          <div className="relative flex-1 flex items-center justify-center aspect-square bg-gray-900">
            {hasPermission === false ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="text-center p-6">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Camera Access Required</h3>
                  <p className="text-gray-300 mb-4 text-sm">Allow camera access to scan products</p>
                  <Button onClick={initializeCamera} className="bg-blue-600 hover:bg-blue-700">
                    Enable Camera
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-b-2xl md:rounded-bl-2xl md:rounded-br-none" />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div
                      className={`w-72 h-48 border-2 rounded-xl transition-all duration-300 shadow-lg ${
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
                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                          <div
                            className="absolute w-full h-1 bg-blue-400 animate-pulse"
                            style={{
                              top: `${(scanProgress / 100) * 100}%`,
                              boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                            }}
                          ></div>
                          <div className="absolute inset-4 border border-blue-300 rounded opacity-50">
                            <Scan className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                          </div>
                        </div>
                      )}
                      {/* Success checkmark */}
                      {scanningState === "success" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Not found indicator */}
                      {scanningState === "not_found" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                            <AlertCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Instruction text */}
                    <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center max-w-xs">
                      <p className="text-white text-sm bg-black/70 px-4 py-2 rounded-full backdrop-bl-sm shadow">
                        {scanningState === "idle" && "Align barcode or QR code within frame"}
                        {scanningState === "scanning" && scanType && `Detecting ${scanType}...`}
                        {scanningState === "scanning" && !scanType && "Scanning..."}
                        {scanningState === "processing" && "Processing..."}
                        {scanningState === "success" && `${scanType || "Code"} detected!`}
                        {scanningState === "not_found" && "Code not found"}
                      </p>
                      {detectedCode && (
                        <p className="text-white/80 text-xs mt-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                          {detectedCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
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

        {/* Right: Product Card & Controls */}
        <div className="md:w-1/2 w-full flex flex-col bg-gradient-to-b from-white/95 to-blue-50/80 dark:from-black/95 dark:to-gray-900/80 p-0 md:p-6 overflow-y-auto max-h-[540px]">
          {/* Progress indicator */}
          {(scanningState === "scanning" || scanningState === "processing") && (
            <div className="p-4 md:p-0">
              <div className="bg-blue-50/80 dark:bg-gray-900/80 rounded-xl p-4 shadow flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="flex-1">
                  <div className="text-blue-900 dark:text-white text-sm mb-1">
                    {scanningState === "scanning" && !scanType && "Scanning for codes..."}
                    {scanningState === "scanning" && scanType === "barcode" && "Reading barcode..."}
                    {scanningState === "scanning" && scanType === "qr" && "Reading QR code..."}
                    {scanningState === "processing" && "Looking up product..."}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product detected card */}
          {scanningState === "success" && detectedProduct && (
            <div className="p-4 md:p-0">
              <Card className="border-green-400 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-3">
                    <img
                      src={detectedProduct.image || "/placeholder.svg"}
                      alt={detectedProduct.name}
                      className="w-28 h-28 object-cover rounded-xl border shadow-md bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">{detectedProduct.name}</h4>
                      <p className="text-xl font-bold text-green-600 mb-1">{detectedProduct.price}</p>
                      {scanType && (
                        <p className="text-xs text-gray-500 capitalize mb-1">
                          Detected via {scanType} {detectedCode && `(${detectedCode.slice(-6)})`}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {detectedProduct.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{detectedProduct.category}</span>
                        )}
                        {detectedProduct.brand && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{detectedProduct.brand}</span>
                        )}
                        {detectedProduct.manufacturer && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{detectedProduct.manufacturer}</span>
                        )}
                      </div>
                      {detectedProduct.description && (
                        <p className="text-xs text-gray-700 dark:text-gray-200 mt-2 line-clamp-3">{detectedProduct.description}</p>
                      )}
                      {detectedProduct.features && detectedProduct.features.length > 0 && (
                        <ul className="text-xs text-gray-700 dark:text-gray-200 mt-2 list-disc list-inside space-y-1">
                          {detectedProduct.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      )}
                      {detectedProduct.stores && detectedProduct.stores.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-1">Available at:</p>
                          <ul className="text-xs text-gray-700 dark:text-gray-200 space-y-1">
                            {detectedProduct.stores.map((store, i) => (
                              <li key={i}>{store.name}: {store.price} <span className="text-xs text-gray-500">({store.availability})</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="text-right min-w-[70px]">
                      <div className="flex items-center space-x-1 justify-end">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{detectedProduct.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{detectedProduct.reviews} reviews</p>
                    </div>
                  </div>
                  {/* Quick social proof */}
                  {detectedProduct.socialProof && (
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-blue-50 dark:bg-blue-900 rounded p-2 text-center">
                        <div className="font-semibold text-blue-600 dark:text-blue-300">{detectedProduct.socialProof.friendsRecommend}%</div>
                        <div className="text-blue-700 dark:text-blue-200">Friends recommend</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900 rounded p-2 text-center">
                        <div className="font-semibold text-green-600 dark:text-green-300">{detectedProduct.socialProof.locationPopularity}%</div>
                        <div className="text-green-700 dark:text-green-200">Local popularity</div>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <Button onClick={handleScanComplete} className="flex-1 bg-green-600 hover:bg-green-700">
                      <Zap className="w-4 h-4 mr-2" />
                      View Social Proof
                    </Button>
                    <Button onClick={retryScanning} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Not found card */}
          {scanningState === "not_found" && (
            <div className="p-4 md:p-0">
              <Card className="border-orange-400 bg-orange-50/95 dark:bg-orange-900/95 backdrop-blur-sm shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img src="/placeholder.svg" alt="Not found" className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-700 dark:text-orange-300 text-base mb-1">Product not found</h4>
                      <p className="text-xs text-orange-600 dark:text-orange-200">No product details available for this barcode.</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button onClick={retryScanning} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bottom Controls */}
          {hasPermission && scanningState === "idle" && (
            <div className="p-4 md:p-0 flex flex-col h-full justify-end">
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleClose} variant="ghost" size="lg" className="text-blue-900 dark:text-white hover:bg-blue-100/40 dark:hover:bg-white/10">
                  Cancel
                </Button>
                <Button
                  onClick={startScanning}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 p-0 shadow-lg"
                >
                  <Camera className="w-8 h-8" />
                </Button>
              </div>
              <p className="text-center text-blue-900 dark:text-white/80 text-sm mt-3">Tap to scan barcodes, QR codes, or product images</p>
            </div>
          )}

          {/* Scanning controls */}
          {scanningState === "scanning" && (
            <div className="p-4 md:p-0">
              <div className="flex justify-center">
                <Button onClick={stopScanning} variant="outline" className="border-blue-600 text-blue-900 dark:text-white hover:bg-blue-100/40 dark:hover:bg-white/10">
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
