"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, Users, TrendingUp, Leaf, ChevronLeft, ChevronRight, Play } from "lucide-react"

interface TutorialStepProps {
  onNext: (data: { completedTutorial: boolean }) => void
  onPrevious: () => void
  onSkip: () => void
  canSkip: boolean
}

export function TutorialStep({ onNext, onPrevious, onSkip, canSkip }: TutorialStepProps) {
  const [currentDemo, setCurrentDemo] = useState(0)

  const demos = [
    {
      icon: Scan,
      title: "Scan Any Product",
      description: "Point your camera at any Walmart product to get instant social proof",
      visual: "📱 → 🔍 → ⭐",
      tip: "Works with barcodes, product images, or even product names!",
    },
    {
      icon: Users,
      title: "See Friend Activity",
      description: "Discover what your friends have bought, recommended, or reviewed",
      visual: "👥 → 💬 → ✅",
      tip: "Friends' recommendations have 89% higher satisfaction rates",
    },
    {
      icon: TrendingUp,
      title: "Local Insights",
      description: "View what's popular in your area and trending with similar shoppers",
      visual: "📍 → 📊 → 🔥",
      tip: "Local popularity increases purchase satisfaction by 23%",
    },
    {
      icon: Leaf,
      title: "Sustainability Check",
      description: "Get eco-scores and find sustainable alternatives for any product",
      visual: "🌱 → 📋 → 🌍",
      tip: "Make environmentally conscious choices with community validation",
    },
  ]

  const currentDemoData = demos[currentDemo]

  const nextDemo = () => {
    if (currentDemo < demos.length - 1) {
      setCurrentDemo(currentDemo + 1)
    }
  }

  const prevDemo = () => {
    if (currentDemo > 0) {
      setCurrentDemo(currentDemo - 1)
    }
  }

  const handleComplete = () => {
    // Pass only the boolean value
    onNext({ completedTutorial: true })
  }

  const handlePrevious = () => {
    onPrevious()
  }

  const handleSkipClick = () => {
    onSkip()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Play className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">How SmartScan Works</h3>
        <p className="text-gray-600">Quick tutorial on getting the most from social proof</p>
      </div>

      {/* Demo Card */}
      <Card className="border-2 border-green-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <currentDemoData.icon className="w-8 h-8 text-green-600" />
            </div>

            <h4 className="text-lg font-semibold text-gray-900">{currentDemoData.title}</h4>
            <p className="text-gray-600">{currentDemoData.description}</p>

            <div className="text-3xl py-4">{currentDemoData.visual}</div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Pro Tip:</strong> {currentDemoData.tip}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Navigation */}
      <div className="flex items-center justify-between">
        <Button onClick={prevDemo} disabled={currentDemo === 0} variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {demos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentDemo ? "bg-green-600" : "bg-gray-300"}`}
            />
          ))}
        </div>

        <Button onClick={nextDemo} disabled={currentDemo === demos.length - 1} variant="outline" size="sm">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center text-sm text-gray-500">
        {currentDemo + 1} of {demos.length}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          Previous
        </Button>
        <Button onClick={handleComplete} className="flex-1 bg-green-600 hover:bg-green-700">
          {currentDemo === demos.length - 1 ? "I'm Ready!" : "Got It!"}
        </Button>
      </div>

      {canSkip && (
        <div className="text-center">
          <Button onClick={handleSkipClick} variant="ghost" size="sm" className="text-gray-500">
            Skip tutorial
          </Button>
        </div>
      )}
    </div>
  )
}
