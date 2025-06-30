"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Gift, Target, Zap, ShoppingCart, Percent, Clock, Star } from "lucide-react"

interface PersonalizedExperienceProps {
  userClassification: "VIP_FREQUENT" | "REGULAR_SHOPPER" | "CART_ABANDONER" | "OCCASIONAL_VISITOR"
  cartAbandonmentRate: number
  avgOrderValue: number
  loyaltyScore: number
}

export function PersonalizedExperience({
  userClassification,
  cartAbandonmentRate,
  avgOrderValue,
  loyaltyScore,
}: PersonalizedExperienceProps) {
  // VIP Frequent Shoppers - Luxury Experience
  if (userClassification === "VIP_FREQUENT") {
    return (
      <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-600" />
            <span className="text-yellow-800">VIP Exclusive Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/achievements">
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Gift className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Free Premium Delivery</h4>
                  <p className="text-sm text-gray-600">Same-day delivery included</p>
                </div>
              </Link>
              <Link href="/social">
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Early Access</h4>
                  <p className="text-sm text-gray-600">New products first</p>
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Your VIP Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>5% cashback on all purchases</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Exclusive member-only deals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Personal shopping assistant</span>
                </li>
              </ul>
            </div>

            <Link href="/assistant">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Continue VIP Shopping Experience
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Cart Abandoners - Conversion Strategy
  if (userClassification === "CART_ABANDONER") {
    return (
      <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-orange-600" />
            <span className="text-orange-800">Complete Your Purchase & Save</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Items in Your Cart</h4>
                <Badge className="bg-orange-100 text-orange-800">3 items waiting</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Don't miss out! Your cart items are popular and selling fast.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-orange-700">Limited time: Extra 15% off if you complete purchase now</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <Percent className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="font-semibold text-green-600">15% OFF</div>
                <div className="text-xs text-gray-600">Complete now</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Zap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold text-blue-600">Free Shipping</div>
                <div className="text-xs text-gray-600">On this order</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Why others completed their purchase:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• "Great quality for the price" - 89% agree</li>
                <li>• "Fast delivery exceeded expectations"</li>
                <li>• "Would definitely buy again" - 76% repurchase rate</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Link href="/scanner" className="flex-1">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Complete Purchase (15% OFF)
                </Button>
              </Link>
              <Link href="/social" className="flex-1">
                <Button variant="outline" className="w-full">
                  Save for Later
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Occasional Visitors - Engagement Strategy
  if (userClassification === "OCCASIONAL_VISITOR") {
    return (
      <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-6 h-6 text-green-600" />
            <span className="text-green-800">Welcome Back! Special Offers Inside</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">We've missed you!</h4>
              <p className="text-sm text-gray-600 mb-3">Here's a special welcome back offer just for you</p>
              <div className="text-3xl font-bold text-green-600 mb-1">20% OFF</div>
              <div className="text-sm text-gray-600">Your next purchase</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/social">
                <div className="bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">Trending</div>
                  <div className="text-xs text-gray-600">Products for you</div>
                </div>
              </Link>
              <Link href="/scanner">
                <div className="bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900">Quick Order</div>
                  <div className="text-xs text-gray-600">Reorder favorites</div>
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">What's new since your last visit:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>New organic product line launched</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free same-day delivery in your area</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Walmart+ membership benefits expanded</span>
                </li>
              </ul>
            </div>

            <Link href="/scanner">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Gift className="w-4 h-4 mr-2" />
                Claim 20% OFF & Start Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular Shoppers - Standard Experience with Upsell
  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-blue-600" />
          <span className="text-blue-800">Valued Customer Perks</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Shopping Stats:</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">${avgOrderValue}</div>
                <div className="text-xs text-gray-600">Avg Order Value</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">{loyaltyScore}</div>
                <div className="text-xs text-gray-600">Loyalty Score</div>
              </div>
            </div>
          </div>

          <Link href="/achievements">
            <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-semibold text-gray-900 mb-2">Unlock VIP Status:</h4>
              <p className="text-sm text-gray-600 mb-3">
                You're only ${(150 - avgOrderValue).toFixed(2)} away from VIP benefits!
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((avgOrderValue / 150) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                VIP benefits include free delivery, exclusive deals, and priority support
              </div>
            </div>
          </Link>

          <Link href="/scanner">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Shop Now & Unlock VIP Status
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
