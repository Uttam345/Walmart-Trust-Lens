"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Shield, Heart, TrendingUp } from "lucide-react"

interface ContactsPermissionStepProps {
  onNext: (data: { contactsPermission: boolean }) => void
  onSkip: () => void
  canSkip: boolean
}

export function ContactsPermissionStep({ onNext, onSkip, canSkip }: ContactsPermissionStepProps) {
  const [isRequesting, setIsRequesting] = useState(false)

  const handleAllow = async () => {
    setIsRequesting(true)

    try {
      // Simulate permission request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real app, this would request actual contacts permission
      const granted = Math.random() > 0.3 // 70% success rate simulation

      setIsRequesting(false)

      // Pass only the boolean value, no event objects
      onNext({ contactsPermission: granted })
    } catch (error) {
      console.error("Permission request error:", error)
      setIsRequesting(false)
      onNext({ contactsPermission: false })
    }
  }

  const handleDeny = () => {
    // Pass only the boolean value
    onNext({ contactsPermission: false })
  }

  const handleSkipClick = () => {
    // Call skip without any parameters
    onSkip()
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Users className="w-8 h-8 text-blue-600" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Connect with Your Friends</h3>
        <p className="text-gray-600 mb-6">
          See what products your friends have purchased and recommended. Your contacts stay private and secure.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
          <Heart className="w-4 h-4 mr-2" />
          Why friends' insights matter:
        </h4>
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3" />
            <span>89% higher satisfaction when friends recommend products</span>
          </li>
          <li className="flex items-center space-x-2">
            <Shield className="w-3 h-3" />
            <span>Avoid products with poor reviews from people you trust</span>
          </li>
          <li className="flex items-center space-x-2">
            <Users className="w-3 h-3" />
            <span>Discover products your social circle loves</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Privacy Protected</span>
        </div>
        <p className="text-sm text-gray-600">
          We only use contact data to show you relevant social proof. Your friends won't see your activity unless you
          choose to share.
        </p>
      </div>

      <div className="flex space-x-3">
        <Button onClick={handleAllow} disabled={isRequesting} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isRequesting ? "Requesting Permission..." : "Allow Access"}
        </Button>
        <Button onClick={handleDeny} variant="outline" className="flex-1">
          Not Now
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
