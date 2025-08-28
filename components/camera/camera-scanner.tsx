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

  const [manualEntryOpen, setManualEntryOpen] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [manualError, setManualError] = useState("")
  const [manualLoading, setManualLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera')

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

            // --- API lookup logic (client-side fetch) ---
            let product: ProcessedProduct | null = null
            try {
              const res = await fetch(`/api/barcode-lookup?barcode=${encodeURIComponent(code)}`)
              if (res.ok) {
                product = await res.json()
                addDebugInfo(`Camera API returned: ${JSON.stringify(product)}`)
              } else {
                const data = await res.json().catch(() => ({}))
                addDebugInfo(`Barcode API error: ${data.error || 'No product found for this barcode.'}`)
              }
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

  const handleManualSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setManualError("")
    if (!manualBarcode.trim()) {
      setManualError("Please enter a barcode number.")
      return
    }
    setManualLoading(true)
    setScanningState("processing")
    setDetectedProduct(null)
    setDetectedCode(manualBarcode)
    setScanType("barcode")
    try {
      // Call the Next.js API route instead of lookupBarcode directly
      const res = await fetch(`/api/barcode-lookup?barcode=${encodeURIComponent(manualBarcode.trim())}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setManualError(data.error || "No product found for this barcode.")
        setDetectedProduct(null)
        setScanningState("not_found")
        setManualLoading(false)
        return
      }
      const product = await res.json()
      addDebugInfo(`Manual API returned: ${JSON.stringify(product)}`)
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
        setManualError("No product found for this barcode.")
      }
    } catch (err) {
      setManualError("Error fetching product. Please try again.")
      setDetectedProduct(null)
      setScanningState("not_found")
    }
    setManualLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanner Modal Container - classic single column */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto flex flex-col overflow-hidden">
        {/* Header with tabs */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button onClick={handleClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex justify-center gap-2">
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${activeTab === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('camera')}
              type="button"
            >
              Scan with Camera
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${activeTab === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('manual')}
              type="button"
            >
              Enter Barcode
            </button>
          </div>
          <Button onClick={toggleFlash} variant="ghost" size="sm">
            {flashEnabled ? <Flash className="w-4 h-4" /> : <FlashOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Camera View or Manual Entry */}
        {activeTab === 'camera' && (
          <div className="relative aspect-square bg-gray-900">
            {hasPermission === false ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                  <p className="text-gray-500 mb-4 text-sm">Allow camera access to scan products</p>
                  <Button onClick={initializeCamera} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Enable Camera
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div
                      className={`w-64 h-40 border-2 rounded-lg transition-all duration-300 ${
                        scanningState === "success"
                          ? "border-green-400"
                          : scanningState === "scanning"
                          ? "border-blue-400"
                          : scanningState === "not_found"
                          ? "border-orange-400"
                          : "border-white"
                      }`}
                    >
                      {/* Corners */}
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                      {/* Scanning line */}
                      {scanningState === "scanning" && (
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
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
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Not found indicator */}
                      {scanningState === "not_found" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <AlertCircle className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Instruction text */}
                    <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 text-center max-w-xs">
                      <p className="text-gray-900 text-sm bg-white/90 px-4 py-2 rounded-full shadow">
                        {scanningState === "idle" && "Align barcode or QR code within frame"}
                        {scanningState === "scanning" && scanType && `Detecting ${scanType}...`}
                        {scanningState === "scanning" && !scanType && "Scanning..."}
                        {scanningState === "processing" && "Processing..."}
                        {scanningState === "success" && `${scanType || "Code"} detected!`}
                        {scanningState === "not_found" && "Code not found"}
                      </p>
                      {detectedCode && (
                        <p className="text-gray-500 text-xs mt-2 bg-white/80 px-3 py-1 rounded-full shadow">
                          {detectedCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="p-4 flex flex-col gap-3 animate-fade-in">
            <label className="font-semibold text-blue-900 text-sm mb-1">Enter Barcode Number</label>
            <input
              type="text"
              value={manualBarcode}
              onChange={e => setManualBarcode(e.target.value)}
              className="border border-blue-400 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
              placeholder="e.g. 0123456789012"
              autoFocus
              disabled={manualLoading}
            />
            {manualError && <div className="text-red-600 text-xs">{manualError}</div>}
            <div className="flex gap-2 mt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={manualLoading}>
                {manualLoading ? "Searching..." : "Lookup"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setActiveTab('camera')} disabled={manualLoading}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="px-4 pb-2">
            <details className="text-gray-500 text-xs">
              <summary className="cursor-pointer">Debug Info</summary>
              <div className="mt-1 space-y-1">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Progress indicator */}
        {(scanningState === "scanning" || scanningState === "processing") && (
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <div className="text-gray-900 text-sm mb-1">
                  {scanningState === "scanning" && !scanType && "Scanning for codes..."}
                  {scanningState === "scanning" && scanType === "barcode" && "Reading barcode..."}
                  {scanningState === "scanning" && scanType === "qr" && "Reading QR code..."}
                  {scanningState === "processing" && "Looking up product..."}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5">
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
          <div className="p-4">
            <Card className="border-green-400 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={detectedProduct.image || "/placeholder.svg"}
                    alt={detectedProduct.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-base mb-1">{detectedProduct.name}</h4>
                    <p className="text-lg font-bold text-green-600 mb-1">{detectedProduct.price}</p>
                    {scanType && (
                      <p className="text-xs text-gray-500 capitalize mb-1">
                        Detected via {scanType} {detectedCode && `(${detectedCode.slice(-6)})`}
                      </p>
                    )}
                    {detectedProduct.category && (
                      <p className="text-xs text-gray-700">Category: {detectedProduct.category}</p>
                    )}
                    {detectedProduct.brand && (
                      <p className="text-xs text-gray-700">Brand: {detectedProduct.brand}</p>
                    )}
                    {detectedProduct.manufacturer && (
                      <p className="text-xs text-gray-700">Manufacturer: {detectedProduct.manufacturer}</p>
                    )}
                    {detectedProduct.description && (
                      <p className="text-xs text-gray-700 mt-1">{detectedProduct.description}</p>
                    )}
                    {detectedProduct.features && detectedProduct.features.length > 0 && (
                      <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                        {detectedProduct.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                    {detectedProduct.stores && detectedProduct.stores.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-800 mb-1">Available at:</p>
                        <ul className="text-xs text-gray-700">
                          {detectedProduct.stores.map((store, i) => (
                            <li key={i}>{store.name}: {store.price} <span className="text-xs text-gray-500">({store.availability})</span></li>
                          ))}
                        </ul>
                      </div>
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
                {detectedProduct.socialProof && (
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <div className="font-semibold text-blue-600">{detectedProduct.socialProof.friendsRecommend}%</div>
                      <div className="text-blue-700">Friends recommend</div>
                    </div>
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="font-semibold text-green-600">{detectedProduct.socialProof.locationPopularity}%</div>
                      <div className="text-green-700">Local popularity</div>
                    </div>
                  </div>
                )}
                <div className="flex space-x-2 mt-2">
                  <Button onClick={handleScanComplete} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
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
          <div className="p-4">
            <Card className="border-orange-400 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img src="/placeholder.svg" alt="Not found" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-700 text-base mb-1">Product not found</h4>
                    <p className="text-xs text-orange-600">No product details available for this barcode.</p>
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
        {activeTab === 'camera' && hasPermission && scanningState === "idle" && (
          <div className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={handleClose} variant="ghost" size="lg">
                Cancel
              </Button>
              <Button
                onClick={startScanning}
                size="lg"
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
              >
                <Camera className="w-8 h-8" />
              </Button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">Tap to scan barcodes, QR codes, or product images</p>
          </div>
        )}
        {/* Scanning controls */}
        {activeTab === 'camera' && scanningState === "scanning" && (
          <div className="p-4">
            <div className="flex justify-center">
              <Button onClick={stopScanning} variant="outline">
                Stop Scanning
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
