"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Camera, 
  Pause, 
  Play, 
  RotateCcw, 
  TreePine, 
  Recycle, 
  Gift, 
  Trash2, 
  AlertTriangle,
  Leaf,
  Zap,
  ThermometerSun,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react"

interface RealTimeEcoResult {
  itemName: string
  category: 'donate' | 'recycle' | 'waste' | 'reuse' | 'hazardous' | 'unknown'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous' | 'unclear'
  confidence: number
  quickAnalysis: string
  sustainabilityScore: number
  carbonImpact: 'low' | 'medium' | 'high'
  quickTips: string[]
  actionRequired?: 'immediate' | 'plan' | 'research' | 'none'
}

interface RealtimeEcoScannerProps {
  onResult?: (result: RealTimeEcoResult) => void
  className?: string
}

export function RealtimeEcoScanner({ onResult, className = "" }: RealtimeEcoScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [currentResult, setCurrentResult] = useState<RealTimeEcoResult | null>(null)
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null)
  const [scanCount, setScanCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setCameraError('Camera access denied. Please allow camera permissions.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Capture frame and analyze
  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0) return

    // Prevent too frequent API calls
    const now = Date.now()
    if (lastScanTime && now - lastScanTime.getTime() < 3000) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current frame
    ctx.drawImage(video, 0, 0)

    // Convert to base64 with reduced quality for faster processing
    const imageData = canvas.toDataURL('image/jpeg', 0.5)

    setIsProcessing(true)
    try {
      const response = await fetch('/api/realtime-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          mode: 'eco'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const result = data.result as RealTimeEcoResult
          setCurrentResult(result)
          setLastScanTime(new Date())
          setScanCount(prev => prev + 1)
          onResult?.(result)
        }
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Provide offline fallback
      const fallbackResult: RealTimeEcoResult = {
        itemName: 'Item Detected',
        category: 'unknown',
        condition: 'unclear',
        confidence: 0.6,
        quickAnalysis: 'Analysis unavailable. Check connection or try detailed scanner.',
        sustainabilityScore: 60,
        carbonImpact: 'medium',
        quickTips: ['Try uploading to detailed scanner', 'Check internet connection', 'Ensure good lighting'],
        actionRequired: 'research'
      }
      setCurrentResult(fallbackResult)
      setLastScanTime(new Date())
      onResult?.(fallbackResult)
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, onResult, lastScanTime])

  // Start/stop scanning
  const toggleScanning = useCallback(() => {
    if (isScanning) {
      // Stop scanning
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      setIsScanning(false)
    } else {
      // Start scanning
      setIsScanning(true)
      scanIntervalRef.current = setInterval(captureAndAnalyze, 4000) // Scan every 4 seconds to reduce quota usage
    }
  }, [isScanning, captureAndAnalyze])

  // Initialize camera on mount
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [startCamera, stopCamera])

  // Get category icon and color
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'donate':
        return { icon: Gift, color: 'text-green-600', bg: 'bg-green-100', label: 'Donate' }
      case 'recycle':
        return { icon: Recycle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Recycle' }
      case 'reuse':
        return { icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Reuse' }
      case 'hazardous':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Hazardous' }
      case 'waste':
        return { icon: Trash2, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Waste' }
      default:
        return { icon: TreePine, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown' }
    }
  }

  // Get carbon impact info
  const getCarbonImpactInfo = (impact: string) => {
    switch (impact) {
      case 'low':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Low Impact' }
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium Impact' }
      case 'high':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'High Impact' }
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown Impact' }
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Camera View */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TreePine className="w-5 h-5 text-green-600" />
              Real-Time Eco Scanner
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Scans: {scanCount}
              </Badge>
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                <div>
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{cameraError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={startCamera}
                  >
                    Retry Camera Access
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning overlay */}
                {isScanning && (
                  <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-pulse">
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Scanning...
                    </div>
                  </div>
                )}
                
                {/* Last scan time */}
                {lastScanTime && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {lastScanTime.toLocaleTimeString()}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button
              onClick={toggleScanning}
              variant={isScanning ? "destructive" : "default"}
              size="lg"
              disabled={!!cameraError}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Scanning
                </>
              )}
            </Button>
            
            <Button
              onClick={captureAndAnalyze}
              variant="outline"
              size="lg"
              disabled={!!cameraError || isProcessing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Single Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {currentResult && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Item Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{currentResult.itemName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{currentResult.quickAnalysis}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getCategoryInfo(currentResult.category).bg} ${getCategoryInfo(currentResult.category).color} border-current`}
                >
                  {React.createElement(getCategoryInfo(currentResult.category).icon, { className: "w-3 h-3 mr-1" })}
                  {getCategoryInfo(currentResult.category).label}
                </Badge>
              </div>

              {/* Scores and Impact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Confidence */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Confidence</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(currentResult.confidence * 100)}%
                  </div>
                  <Progress value={currentResult.confidence * 100} className="mt-2" />
                </div>

                {/* Sustainability Score */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Sustainability</div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentResult.sustainabilityScore}
                  </div>
                  <Progress value={currentResult.sustainabilityScore} className="mt-2" />
                </div>

                {/* Carbon Impact */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Carbon Impact</div>
                  <Badge 
                    variant="outline"
                    className={`${getCarbonImpactInfo(currentResult.carbonImpact).bg} ${getCarbonImpactInfo(currentResult.carbonImpact).color} border-current text-sm`}
                  >
                    <ThermometerSun className="w-3 h-3 mr-1" />
                    {getCarbonImpactInfo(currentResult.carbonImpact).label}
                  </Badge>
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Quick Tips
                </h4>
                <ul className="space-y-1">
                  {currentResult.quickTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Required */}
              {currentResult.actionRequired && currentResult.actionRequired !== 'none' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium capitalize">
                      {currentResult.actionRequired} Action Required
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
