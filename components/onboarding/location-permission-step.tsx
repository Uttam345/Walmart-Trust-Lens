"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Users, Store } from "lucide-react"

interface LocationPermissionStepProps {
  onNext: (data: { locationPermission: boolean }) => void
  onSkip: () => void
  canSkip: boolean
}

export function LocationPermissionStep({ onNext, onSkip, canSkip }: LocationPermissionStepProps) {
  const [isRequesting, setIsRequesting] = useState(false)

  const handleAllow = async () => {
    setIsRequesting(true)

    try {
      // Simulate location permission request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const granted = Math.random() > 0.2 // 80% success rate simulation

      setIsRequesting(false)

      // Pass only the boolean value
      onNext({ locationPermission: granted })
    } catch (error) {
      console.error("Location permission error:", error)
      setIsRequesting(false)
      onNext({ locationPermission: false })
    }
  }

  const handleDeny = () => {
    // Pass only the boolean value
    onNext({ locationPermission: false })
  }

  const handleSkipClick = () => {
    // Call skip without any parameters
    onSkip()
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <MapPin className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Get Local Shopping Insights</h3>
        <p className="text-gray-600 mb-6">
          See what's popular in your area and get recommendations from nearby shoppers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 bg-blue-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Local Trends</h4>
          <p className="text-sm text-gray-600">See what's popular in your city</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Users className="w-6 h-6 text-purple-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Neighbor Reviews</h4>
          <p className="text-sm text-gray-600">Trust local shoppers' opinions</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <Store className="w-6 h-6 text-orange-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Store Insights</h4>
          <p className="text-sm text-gray-600">Find the best deals nearby</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <h4 className="font-semibold text-blue-900 mb-2">Local Social Proof Benefits:</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Products popular in your area are 23% more likely to satisfy</li>
          <li>• Local reviews are 67% more relevant to your needs</li>
          <li>• Find region-specific products and seasonal favorites</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <Button onClick={handleAllow} disabled={isRequesting} className="flex-1 bg-green-600 hover:bg-green-700">
          {isRequesting ? "Getting Location..." : "Share Location"}
        </Button>
        <Button onClick={handleDeny} variant="outline" className="flex-1">
          Use Without Location
        </Button>
      </div>

      {canSkip && (
        <Button onClick={handleSkipClick} variant="ghost" size="sm" className="text-gray-500">
          Skip this step
        </Button>
      )}
    </div>
  )
}
