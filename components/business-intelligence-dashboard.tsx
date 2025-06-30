"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, DollarSign, Target, Crown } from "lucide-react"

export function BusinessIntelligenceDashboard() {
  const businessMetrics = {
    userConversion: {
      cartAbandonersConverted: 23.4, // % converted this month
      occasionalToRegular: 18.7, // % converted
      regularToVIP: 12.3, // % upgraded
    },
    revenueImpact: {
      socialProofInfluencedSales: 2.4, // Million $
      friendRecommendationSales: 890000, // $
      locationPeerSales: 1.2, // Million $
      userClassTargetingSales: 1.8, // Million $
    },
    engagement: {
      avgSessionTime: 8.4, // minutes
      pagesPerSession: 5.2,
      socialProofInteractionRate: 67.8, // %
      friendDataEngagementRate: 89.2, // %
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversion Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>User Conversion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cart Abandoners</span>
                <span className="font-semibold text-green-600">
                  +{businessMetrics.userConversion.cartAbandonersConverted}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Occasional → Regular</span>
                <span className="font-semibold text-blue-600">
                  +{businessMetrics.userConversion.occasionalToRegular}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Regular → VIP</span>
                <span className="font-semibold text-yellow-600">+{businessMetrics.userConversion.regularToVIP}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Revenue Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${businessMetrics.revenueImpact.socialProofInfluencedSales}M
                </div>
                <div className="text-xs text-gray-600">Social proof influenced</div>
              </div>
              <div className="text-sm text-gray-700">
                <div>Friends: ${(businessMetrics.revenueImpact.friendRecommendationSales / 1000).toFixed(0)}K</div>
                <div>Location: ${businessMetrics.revenueImpact.locationPeerSales}M</div>
                <div>User Class: ${businessMetrics.revenueImpact.userClassTargetingSales}M</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Session</span>
                <span className="font-semibold">{businessMetrics.engagement.avgSessionTime}min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Social Proof Rate</span>
                <span className="font-semibold text-blue-600">
                  {businessMetrics.engagement.socialProofInteractionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Friend Data Rate</span>
                <span className="font-semibold text-purple-600">
                  {businessMetrics.engagement.friendDataEngagementRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">High-Impact Strategies</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span>VIP customers generate 3.2x more revenue per visit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Friend recommendations have 89% higher conversion rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Location-based social proof increases basket size by 23%</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                  <span>Cart abandoner targeting recovers $890K monthly</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Optimization Opportunities</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Increase friend data collection by 15% for higher engagement</li>
                <li>• Expand location-based recommendations to drive local sales</li>
                <li>• Implement dynamic pricing based on user classification</li>
                <li>• Create VIP-exclusive products to increase tier upgrades</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
