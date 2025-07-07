"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  X,
  Camera,
  FlashlightOffIcon as FlashOff,
  FlashlightIcon as Flash,
  RotateCcw,
  Zap,
  CheckCircle,
  Scan,
  AlertCircle,
  Target,
  Eye,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RealtimeCameraScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (productData: any) => void
  mode?: 'product' | 'eco'
}

interface ScanFrame {
  x: number
  y: number
  width: number
  height: number
}

export function RealtimeCameraScanner({ 
  isOpen, 
  onClose, 
  onScanComplete, 
  mode = 'product' 
}: RealtimeCameraScannerProps) {
  const { toast } = useToast()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [detectionStatus, setDetectionStatus] = useState<string>("Initializing...")
  const [scanFrame, setScanFrame] = useState<ScanFrame>({ x: 0, y: 0, width: 0, height: 0 })
  const [realtimeFeedback, setRealtimeFeedback] = useState<string[]>([])
  const [autoScanEnabled, setAutoScanEnabled] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameCountRef = useRef(0)
  const lastAnalysisRef = useRef(0)

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setDetectionStatus("Requesting camera permission...")
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        setDetectionStatus("Camera ready - Position your item in the frame")
        
        // Start real-time analysis
        startRealtimeAnalysis()
      }
    } catch (error) {
      console.error('Camera initialization error:', error)
      setHasPermission(false)
      setDetectionStatus("Camera access denied")
      toast({
        title: "Camera Access Required",
        description: "Please enable camera permissions to use the scanner",
        variant: "destructive",
      })
    }
  }, [toast])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
      analysisIntervalRef.current = null
    }
    setHasPermission(null)
  }, [])

  // Toggle flash (for supported devices)
  const toggleFlash = useCallback(async () => {
    if (streamRef.current) {
      try {
        const track = streamRef.current.getVideoTracks()[0]
        const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
        
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }] as unknown as MediaTrackConstraintSet[]
          })
          setFlashEnabled(!flashEnabled)
        } else {
          toast({
            title: "Flash Not Available",
            description: "Your device doesn't support camera flash",
          })
        }
      } catch (error) {
        console.error('Flash toggle error:', error)
      }
    }
  }, [flashEnabled, toast])

  // Capture frame from video
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0) return null

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame
    ctx.drawImage(video, 0, 0)

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.7)
  }, [])

  // Rate limiting and retry state
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const [retryDelay, setRetryDelay] = useState(1000)
  const [backoffMultiplier, setBackoffMultiplier] = useState(1)
  const maxRetryDelay = 30000 // 30 seconds max

  // Real-time analysis with rate limiting and retry logic
  const analyzeFrame = useCallback(async () => {
    if (isAnalyzing || !autoScanEnabled || rateLimitExceeded) return

    const now = Date.now()
    const minInterval = rateLimitExceeded ? retryDelay * backoffMultiplier : 2000 // Increase interval if rate limited
    
    if (now - lastAnalysisRef.current < minInterval) return

    const frameData = captureFrame()
    if (!frameData) return

    lastAnalysisRef.current = now
    setIsAnalyzing(true)
    frameCountRef.current++

    try {
      const response = await fetch('/api/realtime-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: frameData,
          mode: mode,
          frameCount: frameCountRef.current
        }),
      })

      const data = await response.json()
      
      // Handle rate limiting
      if (response.status === 429 || data.error?.includes('rate limit') || data.error?.includes('quota')) {
        console.warn('Rate limit exceeded, implementing backoff strategy')
        setRateLimitExceeded(true)
        setBackoffMultiplier(prev => Math.min(prev * 1.5, 8)) // Exponential backoff up to 8x
        setDetectionStatus("Reducing scan frequency due to API limits...")
        setRealtimeFeedback(["Scanning less frequently to stay within limits", "Manual capture still available"])
        
        // Reset rate limit status after delay
        setTimeout(() => {
          setRateLimitExceeded(false)
          setBackoffMultiplier(1)
          setDetectionStatus("Ready to scan - position your item")
        }, retryDelay * backoffMultiplier)
        
        return
      }
      
      // Reset backoff on successful request
      if (response.ok && data.success) {
        setRateLimitExceeded(false)
        setBackoffMultiplier(1)
        
        if (data.result) {
          const result = data.result
          setConfidence(result.confidence)
          
          // Update detection status based on result
          if (result.detected && result.confidence > 70) {
            setDetectionStatus(`${mode === 'product' ? 'Product' : 'Item'} detected: ${result.productName || result.itemName}`)
            setRealtimeFeedback(result.suggestions || result.quickTips || [])
            
            // Auto-capture if confidence is high enough
            if (result.confidence > 85 && result.action === 'capture') {
              await performFullScan()
            }
          } else {
            setDetectionStatus(getStatusMessage(result.action, result.confidence))
            setRealtimeFeedback(result.suggestions || result.quickTips || [])
          }
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Real-time analysis error:', error)
      
      // Handle different types of errors
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        setRateLimitExceeded(true)
        setDetectionStatus("API limits reached - manual scan available")
        setRealtimeFeedback(["Use manual capture button below", "Real-time scanning paused temporarily"])
      } else {
        setDetectionStatus("Analysis error - try adjusting lighting")
        setRealtimeFeedback(["Ensure good lighting", "Hold camera steady", "Try manual capture"])
      }
    } finally {
      setIsAnalyzing(false)
    }
  }, [isAnalyzing, autoScanEnabled, captureFrame, mode, rateLimitExceeded, retryDelay, backoffMultiplier])

  // Start real-time analysis loop with adaptive intervals
  const startRealtimeAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) return

    const getAdaptiveInterval = () => {
      if (rateLimitExceeded) return retryDelay * backoffMultiplier
      return 3000 // Default 3 second interval to be more conservative
    }

    const scheduleNextAnalysis = () => {
      if (analysisIntervalRef.current) {
        clearTimeout(analysisIntervalRef.current)
      }
      
      analysisIntervalRef.current = setTimeout(() => {
        analyzeFrame().finally(() => {
          if (autoScanEnabled && !rateLimitExceeded) {
            scheduleNextAnalysis()
          }
        })
      }, getAdaptiveInterval())
    }

    scheduleNextAnalysis()
  }, [analyzeFrame, rateLimitExceeded, retryDelay, backoffMultiplier, autoScanEnabled])

  // Get status message based on action
  const getStatusMessage = (action: string, confidence: number): string => {
    switch (action) {
      case 'move_closer':
        return "Move closer to the item"
      case 'adjust_angle':
        return "Adjust camera angle"
      case 'add_light':
        return "Need better lighting"
      case 'scan_more':
        return confidence > 30 ? "Keep scanning..." : "Looking for items..."
      default:
        return "Position item in frame"
    }
  }

  // Perform full detailed scan with retry mechanism
  const performFullScan = useCallback(async () => {
    const frameData = captureFrame()
    if (!frameData) {
      toast({
        title: "Capture Failed",
        description: "Unable to capture image. Please try again.",
        variant: "destructive",
      })
      return
    }

    setDetectionStatus("Performing detailed analysis...")
    setIsAnalyzing(true)
    setAutoScanEnabled(false)

    // Retry mechanism for full scan
    const maxRetries = 3
    let retryCount = 0
    
    const attemptScan = async (): Promise<any> => {
      try {
        // Convert data URL to blob
        const response = await fetch(frameData)
        const blob = await response.blob()
        
        // Create form data
        const formData = new FormData()
        formData.append('image', blob, 'capture.jpg')

        // Send to appropriate API endpoint
        const apiEndpoint = mode === 'product' ? '/api/product-scan' : '/api/eco-scan'
        const scanResponse = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
        })

        const scanData = await scanResponse.json()

        // Handle rate limiting in full scan
        if (scanResponse.status === 429 || scanData.error?.includes('rate limit') || scanData.error?.includes('quota')) {
          if (retryCount < maxRetries) {
            retryCount++
            const delay = Math.min(5000 * retryCount, 15000) // 5s, 10s, 15s delays
            setDetectionStatus(`Rate limit reached - retrying in ${delay/1000}s... (${retryCount}/${maxRetries})`)
            
            await new Promise(resolve => setTimeout(resolve, delay))
            return attemptScan()
          } else {
            throw new Error('API rate limit exceeded. Please try again later.')
          }
        }

        if (scanData.success) {
          return scanData.data || scanData.result
        } else {
          throw new Error(scanData.error || 'Scan failed')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (retryCount < maxRetries && errorMessage.includes('rate limit')) {
          retryCount++
          const delay = Math.min(5000 * retryCount, 15000)
          setDetectionStatus(`Retrying scan in ${delay/1000}s... (${retryCount}/${maxRetries})`)
          
          await new Promise(resolve => setTimeout(resolve, delay))
          return attemptScan()
        }
        throw error
      }
    }

    try {
      const result = await attemptScan()
      setDetectionStatus("Analysis complete!")
      onScanComplete(result)
      onClose()
      
      toast({
        title: "Scan Complete",
        description: `Successfully analyzed ${mode === 'product' ? 'product' : 'item'}`,
      })
    } catch (error) {
      console.error('Full scan error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage.includes('rate limit')) {
        setDetectionStatus("API limits reached - try again later")
        toast({
          title: "Rate Limit Exceeded",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        })
      } else {
        setDetectionStatus("Scan failed - try again")
        toast({
          title: "Scan Failed",
          description: "Unable to analyze item. Please try again with better lighting.",
          variant: "destructive",
        })
      }
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAutoScanEnabled(true), 3000) // Longer delay after full scan
    }
  }, [captureFrame, mode, onScanComplete, onClose, toast])

  // Initialize camera when component opens
  useEffect(() => {
    if (isOpen && hasPermission === null) {
      initializeCamera()
    }
    
    return () => {
      if (!isOpen) {
        stopCamera()
      }
    }
  }, [isOpen, hasPermission, initializeCamera, stopCamera])

  // Calculate scan frame position
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const rect = video.getBoundingClientRect()
      const frameSize = Math.min(rect.width, rect.height) * 0.7
      
      setScanFrame({
        x: (rect.width - frameSize) / 2,
        y: (rect.height - frameSize) / 2,
        width: frameSize,
        height: frameSize,
      })
    }
  }, [hasPermission])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h3 className="font-semibold">
                {mode === 'product' ? 'Product Scanner' : 'Eco Scanner'}
              </h3>
              <p className="text-sm text-white/80">{detectionStatus}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {rateLimitExceeded && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400">
                Rate Limited
              </Badge>
            )}
            <Badge variant={confidence > 70 ? "default" : "secondary"}>
              {confidence}% confident
            </Badge>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {hasPermission ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Scan Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Dark overlay with cutout */}
                <div className="absolute inset-0 bg-black/50" />
                <div
                  className="absolute border-2 border-white rounded-lg"
                  style={{
                    left: `${scanFrame.x}px`,
                    top: `${scanFrame.y}px`,
                    width: `${scanFrame.width}px`,
                    height: `${scanFrame.height}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400" />
                  
                  {/* Scanning animation */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-green-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : hasPermission === false ? (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                <p className="text-gray-300 mb-4">
                  Enable camera permissions to use the scanner
                </p>
                <Button onClick={initializeCamera} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Enable Camera
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent mx-auto mb-4" />
              <p className="text-lg">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        {/* Real-time Feedback */}
        {realtimeFeedback.length > 0 && (
          <div className="mb-4">
            <div className="bg-black/60 rounded-lg p-3">
              <div className="text-white text-sm space-y-1">
                {realtimeFeedback.slice(0, 2).map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-400" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {confidence > 0 && (
          <div className="mb-4">
            <Progress value={confidence} className="h-2" />
            <p className="text-white text-xs mt-1 text-center">
              Detection confidence: {confidence}%
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFlash}
            className="bg-black/60 border-white/20 text-white hover:bg-white/20"
          >
            {flashEnabled ? <Flash className="h-5 w-5" /> : <FlashOff className="h-5 w-5" />}
          </Button>

          <Button
            onClick={performFullScan}
            disabled={isAnalyzing}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="h-5 w-5 mr-2" />
                Capture & Analyze
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setAutoScanEnabled(!autoScanEnabled)}
            className={`bg-black/60 border-white/20 text-white hover:bg-white/20 ${
              autoScanEnabled ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <Target className={`h-5 w-5 ${autoScanEnabled ? 'text-green-400' : ''}`} />
          </Button>
        </div>
        
        <p className="text-white/60 text-xs text-center mt-2">
          {rateLimitExceeded 
            ? `Rate limited - manual mode only (backoff: ${backoffMultiplier}x)`
            : autoScanEnabled 
              ? 'Auto-scan enabled' 
              : 'Manual capture mode'
          }
        </p>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
