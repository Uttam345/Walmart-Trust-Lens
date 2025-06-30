"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Settings, X, ArrowRight } from "lucide-react"

interface QuickStartBannerProps {
  onStartSetup: () => void
}

export function QuickStartBanner({ onStartSetup }: QuickStartBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Unlock Personalized Shopping</h4>
              <p className="text-sm text-gray-600">
                Complete your profile to get friend insights, local trends, and personalized recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onStartSetup} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
