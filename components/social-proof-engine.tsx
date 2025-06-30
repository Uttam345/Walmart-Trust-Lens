"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MapPin, ShoppingCart, Star, Heart } from "lucide-react"

interface SocialProofData {
  friendsPurchases: {
    friendName: string
    avatar: string
    productName: string
    purchaseDate: string
    rating: number
    review?: string
  }[]
  locationPeers: {
    city: string
    zipCode: string
    totalPurchases: number
    avgRating: number
    topReasons: string[]
  }
  userClassPeers: {
    classification: string
    purchaseRate: number
    satisfactionRate: number
    repurchaseRate: number
    commonAlternatives: string[]
  }
}

export function SocialProofEngine({
  productId,
  userClassification,
  userLocation,
}: {
  productId: string
  userClassification: string
  userLocation: { city: string; zipCode: string }
}) {
  // Mock social proof data (in real app, this would come from Walmart's data analytics)
  const socialProofData: SocialProofData = {
    friendsPurchases: [
      {
        friendName: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        productName: "Great Value Organic Honey",
        purchaseDate: "3 days ago",
        rating: 5,
        review: "Perfect for my morning tea! Great quality.",
      },
      {
        friendName: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        productName: "Great Value Organic Honey",
        purchaseDate: "1 week ago",
        rating: 4,
        review: "Good value for organic honey",
      },
      {
        friendName: "Alex Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        productName: "Great Value Organic Honey",
        purchaseDate: "2 weeks ago",
        rating: 5,
      },
    ],
    locationPeers: {
      city: userLocation.city,
      zipCode: userLocation.zipCode,
      totalPurchases: 1247,
      avgRating: 4.6,
      topReasons: ["Great taste", "Good value", "Organic quality"],
    },
    userClassPeers: {
      classification: userClassification,
      purchaseRate: 0.89, // 89% of similar users purchased
      satisfactionRate: 0.94, // 94% satisfaction
      repurchaseRate: 0.76, // 76% repurchase rate
      commonAlternatives: ["Nature Nate's Honey", "Local Harvest Honey"],
    },
  }

  return (
    <div className="space-y-6">
      {/* Friends' Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Your Friends' Experiences</span>
            <span className="text-sm font-normal text-gray-500">(Based on your contacts)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialProofData.friendsPurchases.map((friend, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {friend.friendName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{friend.friendName}</span>
                    <span className="text-sm text-gray-500">bought this {friend.purchaseDate}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < friend.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  {friend.review && <p className="text-sm text-gray-700 italic">"{friend.review}"</p>}
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Ask Friends About This Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location-Based Peers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Shoppers in {socialProofData.locationPeers.city}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {socialProofData.locationPeers.totalPurchases.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Local purchases</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{socialProofData.locationPeers.avgRating}★</div>
              <div className="text-sm text-gray-600">Average rating</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Top reasons locals love this:</p>
            {socialProofData.locationPeers.topReasons.map((reason, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Class Peers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <span>Shoppers Like You</span>
            <span className="text-sm font-normal text-gray-500">({socialProofData.userClassPeers.classification})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(socialProofData.userClassPeers.purchaseRate * 100)}%
              </div>
              <div className="text-xs text-gray-600">Purchase rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(socialProofData.userClassPeers.satisfactionRate * 100)}%
              </div>
              <div className="text-xs text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(socialProofData.userClassPeers.repurchaseRate * 100)}%
              </div>
              <div className="text-xs text-gray-600">Repurchase</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-900 mb-2">Similar shoppers also considered:</p>
            <div className="flex flex-wrap gap-2">
              {socialProofData.userClassPeers.commonAlternatives.map((alt, index) => (
                <span key={index} className="px-2 py-1 bg-white text-purple-700 text-xs rounded-full">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
