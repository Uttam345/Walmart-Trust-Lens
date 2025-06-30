import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users, TrendingUp, Eye, MessageSquare, ThumbsUp } from "lucide-react"

export function SocialProofShowcase() {
  const featuredProducts = [
    {
      id: "honey123",
      name: "Great Value Organic Honey",
      image: "/placeholder.svg?height=120&width=120",
      price: "$4.98",
      socialStats: {
        rating: 4.8,
        reviews: 2847,
        scans: 15420,
        trending: "+23%",
        communityLikes: 1205,
        discussions: 89,
      },
      socialProof: {
        recentActivity: "127 people scanned this in the last hour",
        trendingReason: "Trending in Organic Foods",
        communityEndorsement: "92% of community recommends",
      },
    },
    {
      id: "detergent456",
      name: "Tide Ultra Concentrated Detergent",
      image: "/placeholder.svg?height=120&width=120",
      price: "$12.97",
      socialStats: {
        rating: 4.6,
        reviews: 5234,
        scans: 28950,
        trending: "+18%",
        communityLikes: 2156,
        discussions: 156,
      },
      socialProof: {
        recentActivity: "89 people bought this after scanning",
        trendingReason: "Top choice in Laundry Care",
        communityEndorsement: "89% repurchase rate",
      },
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See What Your Community is Choosing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time social proof from millions of Walmart shoppers helps you make confident purchasing decisions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-3">{product.price}</p>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{product.socialStats.rating}</span>
                      <span className="text-gray-500">({product.socialStats.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Social Proof Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="font-semibold text-gray-900">{product.socialStats.scans.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">Scans</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-semibold text-green-600">{product.socialStats.trending}</span>
                    </div>
                    <p className="text-xs text-gray-600">Growth</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <ThumbsUp className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {product.socialStats.communityLikes.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                </div>

                {/* Social Proof Messages */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700">{product.socialProof.recentActivity}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">{product.socialProof.trendingReason}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{product.socialProof.communityEndorsement}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link href={`/scanner?product=${product.id}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View Social Stats</Button>
                  </Link>
                  <Link href={`/social?product=${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
