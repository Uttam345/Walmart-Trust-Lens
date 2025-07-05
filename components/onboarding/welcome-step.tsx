"use client"

import { Button } from "@/components/ui/button"
import { Scan, Users, Leaf, Star, Sparkles, ArrowRight, X } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
  onSkipAll: () => void
  isFirst: boolean
}

export function WelcomeStep({ onNext, onSkipAll, isFirst }: WelcomeStepProps) {
  const handleNext = () => {
    // Don't pass any data, just proceed
    onNext()
  }

  const handleSkipAll = () => {
    // Skip the entire onboarding process
    onSkipAll()
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="w-10 h-10 text-blue-600" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Future of Shopping!</h3>
        <p className="text-lg text-gray-600 mb-6">
          TrustLens uses the power of community to help you make smarter purchases at Walmart.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Scan className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Smart Scanning</h4>
          <p className="text-sm text-gray-600">Instant social proof for any product</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Users className="w-6 h-6 text-green-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Friend Insights</h4>
          <p className="text-sm text-gray-600">See what your friends really think</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Leaf className="w-6 h-6 text-purple-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Eco-Friendly</h4>
          <p className="text-sm text-gray-600">Make sustainable choices easily</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Personalized</h4>
          <p className="text-sm text-gray-600">Tailored to your shopping style</p>
        </div>
      </div>

      {/* Setup Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">Why set up your profile?</h4>
        <ul className="text-sm text-gray-700 space-y-1 text-left">
          <li>• Get personalized recommendations from similar shoppers</li>
          <li>• See what your friends have purchased and loved</li>
          <li>• Discover local trends and popular products in your area</li>
          <li>• Find eco-friendly alternatives that match your values</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button onClick={handleNext} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
          <ArrowRight className="w-4 h-4 mr-2" />
          Personalize My Experience (2 min)
        </Button>

        <Button onClick={handleSkipAll} variant="outline" size="lg" className="w-full">
          <X className="w-4 h-4 mr-2" />
          Skip Setup & Start Shopping
        </Button>

        <p className="text-xs text-gray-500">You can always customize your preferences later in settings</p>
      </div>
    </div>
  )
}
