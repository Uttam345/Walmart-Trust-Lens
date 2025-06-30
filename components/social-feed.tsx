import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Star, TrendingUp, Users } from "lucide-react"

export function SocialFeed() {
  const posts = [
    {
      user: { name: "Sarah M.", avatar: "/placeholder.svg?height=40&width=40", level: "Gold" },
      time: "2 hours ago",
      content:
        "Just discovered this amazing organic honey! The taste is incredible and the price is unbeatable. Highly recommend! 🍯",
      product: "Great Value Organic Honey",
      rating: 5,
      likes: 24,
      comments: 8,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      user: { name: "Mike R.", avatar: "/placeholder.svg?height=40&width=40", level: "Silver" },
      time: "5 hours ago",
      content:
        "Compared 5 different laundry detergents and this one came out on top for both cleaning power and value. Great find!",
      product: "Tide Ultra Concentrated",
      rating: 4,
      likes: 18,
      comments: 12,
    },
    {
      user: { name: "Emma L.", avatar: "/placeholder.svg?height=40&width=40", level: "Platinum" },
      time: "1 day ago",
      content:
        "Love how the SmartScan helped me avoid a product with poor reviews. Saved me $30 and a lot of disappointment!",
      likes: 45,
      comments: 15,
    },
  ]

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.user.level === "Platinum"
                          ? "bg-gray-100 text-gray-800"
                          : post.user.level === "Gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.user.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 mb-4">{post.content}</p>

            {post.product && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{post.product}</h5>
                    {post.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < post.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">Community Choice</span>
                      </div>
                    )}
                  </div>
                  {post.image && (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.product}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Social Proof Indicators */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>+156 purchases influenced</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-blue-500" />
                    <span>92% satisfaction rate</span>
                  </span>
                </div>

                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  View Social Stats & Buy
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                  <Heart className="w-4 h-4 mr-1" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
