"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Settings, Users, MapPin, User, Leaf, BookOpen, CheckCircle } from "lucide-react"

export function ProfileSetupCard() {
  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("walmart-user-data")
        return data ? JSON.parse(data) : null
      } catch {
        return null
      }
    }
    return null
  })

  if (!userData) return null

  // Calculate setup completion
  const setupItems = [
    { key: "contactsPermission", label: "Friend Connections", icon: Users, completed: userData.contactsPermission },
    { key: "locationPermission", label: "Location Services", icon: MapPin, completed: userData.locationPermission },
    { key: "name", label: "Personal Info", icon: User, completed: !!userData.name },
    {
      key: "sustainabilityImportance",
      label: "Sustainability Preferences",
      icon: Leaf,
      completed: userData.sustainabilityImportance > 5,
    },
    { key: "completedTutorial", label: "Tutorial", icon: BookOpen, completed: userData.completedTutorial },
  ]

  const completedItems = setupItems.filter((item) => item.completed).length
  const completionPercentage = (completedItems / setupItems.length) * 100

  // Don't show if fully completed
  if (completionPercentage === 100) return null

  const handleCompleteSetup = () => {
    // Trigger onboarding flow
    const event = new CustomEvent("restart-onboarding")
    window.dispatchEvent(event)
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-orange-600" />
          <span>Complete Your Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Setup Progress</span>
            <span className="font-medium">{Math.round(completionPercentage)}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {setupItems.map((item) => (
            <div key={item.key} className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.completed ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {item.completed ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <item.icon className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className={`text-sm ${item.completed ? "text-green-700" : "text-gray-600"}`}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-3 border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-1">Why complete your profile?</h4>
          <ul className="text-xs text-orange-800 space-y-1">
            <li>• Get 3x more relevant product recommendations</li>
            <li>• See what friends are buying and loving</li>
            <li>• Discover local trends and deals in your area</li>
          </ul>
        </div>

        <Button onClick={handleCompleteSetup} className="w-full bg-orange-600 hover:bg-orange-700">
          Complete Setup ({setupItems.length - completedItems} steps remaining)
        </Button>
      </CardContent>
    </Card>
  )
}
