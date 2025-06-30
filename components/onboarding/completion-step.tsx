"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Sparkles, Gift, Crown, Zap } from "lucide-react"

interface CompletionStepProps {
  data: any
  onNext: () => void
}

export function CompletionStep({ data, onNext }: CompletionStepProps) {
  // Determine user classification based on onboarding data
  const getUserClassification = () => {
    const { shoppingFrequency = "", avgSpending = "" } = data || {}

    if (shoppingFrequency === "weekly" && (avgSpending === "100-200" || avgSpending === "over-200")) {
      return "VIP_FREQUENT"
    } else if (shoppingFrequency === "occasional" || avgSpending === "under-50") {
      return "OCCASIONAL_VISITOR"
    } else {
      return "REGULAR_SHOPPER"
    }
  }

  const classification = getUserClassification()

  const getWelcomeMessage = () => {
    switch (classification) {
      case "VIP_FREQUENT":
        return {
          title: "Welcome to VIP Status!",
          subtitle: "You've unlocked premium features",
          icon: Crown,
          color: "yellow",
          benefits: [
            "5% cashback on all purchases",
            "Free premium delivery",
            "Early access to new products",
            "Personal shopping assistant",
          ],
        }
      case "OCCASIONAL_VISITOR":
        return {
          title: "Welcome Back Offer!",
          subtitle: "Special deals just for you",
          icon: Gift,
          color: "green",
          benefits: [
            "20% off your next purchase",
            "Personalized product recommendations",
            "Local trending insights",
            "Eco-friendly alternatives",
          ],
        }
      default:
        return {
          title: "You're All Set!",
          subtitle: "Start discovering with social proof",
          icon: Sparkles,
          color: "blue",
          benefits: [
            "Friend purchase insights",
            "Local popularity data",
            "Community recommendations",
            "Sustainability scores",
          ],
        }
    }
  }

  const welcome = getWelcomeMessage()

  const handleNext = () => {
    // Don't pass any data, just proceed
    onNext()
  }

  return (
    <div className="text-center space-y-6">
      <div className={`w-20 h-20 bg-${welcome.color}-100 rounded-full flex items-center justify-center mx-auto`}>
        <welcome.icon className={`w-10 h-10 text-${welcome.color}-600`} />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{welcome.title}</h3>
        <p className="text-lg text-gray-600 mb-6">{welcome.subtitle}</p>
      </div>

      {/* Setup Summary */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Setup Complete!</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">✓ Contacts: </span>
              <span className="text-green-900">{data?.contactsPermission ? "Connected" : "Skipped"}</span>
            </div>
            <div>
              <span className="text-green-700">✓ Location: </span>
              <span className="text-green-900">{data?.locationPermission ? "Enabled" : "Disabled"}</span>
            </div>
            <div>
              <span className="text-green-700">✓ Preferences: </span>
              <span className="text-green-900">Configured</span>
            </div>
            <div>
              <span className="text-green-700">✓ Tutorial: </span>
              <span className="text-green-900">{data?.completedTutorial ? "Completed" : "Skipped"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Your Benefits:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {welcome.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 text-left">
              <Zap className={`w-4 h-4 text-${welcome.color}-600`} />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Ready to start?</h4>
          <p className="text-sm text-blue-800 mb-3">
            Try scanning your first product to see the power of social proof in action!
          </p>
          <div className="text-xs text-blue-700">
            💡 Tip: Start with a product you're considering buying to see how friends and neighbors rate it
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleNext} size="lg" className={`bg-${welcome.color}-600 hover:bg-${welcome.color}-700 px-8`}>
        Start Shopping with Social Proof!
      </Button>
    </div>
  )
}
