"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Target, TrendingUp } from "lucide-react"

// User classification based on Walmart's business intelligence
export interface UserProfile {
  id: string
  name: string
  classification: "VIP_FREQUENT" | "REGULAR_SHOPPER" | "CART_ABANDONER" | "OCCASIONAL_VISITOR"
  spendingTier: "HIGH" | "MEDIUM" | "LOW"
  visitFrequency: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "RARE"
  cartAbandonmentRate: number
  avgOrderValue: number
  totalLifetimeValue: number
  loyaltyScore: number
  location: {
    city: string
    zipCode: string
    region: string
  }
  friends: string[] // Contact-based friend IDs
  purchaseHistory: any[]
}

export function UserClassificationSystem({ userId }: { userId: string }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Simulate user classification (in real app, this would come from Walmart's analytics)
  useEffect(() => {
    // Mock user profile based on business intelligence
    const mockProfile: UserProfile = {
      id: userId,
      name: "Sarah Johnson",
      classification: "VIP_FREQUENT", // This would be determined by ML algorithms
      spendingTier: "HIGH",
      visitFrequency: "WEEKLY",
      cartAbandonmentRate: 0.15, // 15% abandonment rate
      avgOrderValue: 127.5,
      totalLifetimeValue: 15420,
      loyaltyScore: 92,
      location: {
        city: "Austin",
        zipCode: "78701",
        region: "Central Texas",
      },
      friends: ["friend1", "friend2", "friend3"],
      purchaseHistory: [],
    }
    setUserProfile(mockProfile)
  }, [userId])

  if (!userProfile) return null

  const getClassificationDisplay = (classification: string) => {
    switch (classification) {
      case "VIP_FREQUENT":
        return {
          label: "VIP Frequent Shopper",
          icon: Crown,
          color: "bg-yellow-100 text-yellow-800",
          description: "Premium experience unlocked",
        }
      case "REGULAR_SHOPPER":
        return {
          label: "Regular Shopper",
          icon: Star,
          color: "bg-blue-100 text-blue-800",
          description: "Valued customer",
        }
      case "CART_ABANDONER":
        return {
          label: "Smart Shopper",
          icon: Target,
          color: "bg-orange-100 text-orange-800",
          description: "Special offers available",
        }
      case "OCCASIONAL_VISITOR":
        return {
          label: "Welcome Back",
          icon: TrendingUp,
          color: "bg-green-100 text-green-800",
          description: "Exclusive deals waiting",
        }
      default:
        return {
          label: "Shopper",
          icon: Star,
          color: "bg-gray-100 text-gray-800",
          description: "Welcome to Walmart",
        }
    }
  }

  const classificationInfo = getClassificationDisplay(userProfile.classification)

  return (
    <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <classificationInfo.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">Welcome back, {userProfile.name}!</h3>
                <Badge className={classificationInfo.color}>{classificationInfo.label}</Badge>
              </div>
              <p className="text-sm text-gray-600">{classificationInfo.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">${userProfile.totalLifetimeValue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Lifetime Value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
