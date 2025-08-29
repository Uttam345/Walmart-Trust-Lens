import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Star, TrendingUp, Users } from "lucide-react"

export function SocialFeed() {
  const posts = [
    {
      user: { name: "Priya Sharma", avatar: "/placeholder.svg?height=40&width=40", level: "Gold" },
      time: "2 hours ago",
      content:
        "Found this pure ghee at an amazing price! Perfect for festivals and daily cooking. My family loves the quality!",
      product: "Amul Pure Cow Ghee 1L",
      rating: 5,
      likes: 34,
      comments: 12,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      user: { name: "Rajesh Kumar", avatar: "/placeholder.svg?height=40&width=40", level: "Silver" },
      time: "4 hours ago",
      content:
        "Compared different atta brands and this one gives the softest rotis! Great value for money and my wife approved!",
      product: "Aashirvaad Whole Wheat Atta 10kg",
      rating: 4,
      likes: 28,
      comments: 15,
    },
    {
      user: { name: "Arjun Patel", avatar: "/placeholder.svg?height=40&width=40", level: "Gold" },
      time: "6 hours ago",
      content:
        "This basmati rice is restaurant quality! Perfect for biryani and pulao. The fragrance is amazing!",
      product: "India Gate Basmati Rice 5kg",
      rating: 5,
      likes: 41,
      comments: 9,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      user: { name: "Sneha Rajpoot", avatar: "/placeholder.svg?height=40&width=40", level: "Silver" },
      time: "8 hours ago",
      content:
        "Finally found good quality turmeric powder! My mom tested it and said it's as good as the one from our village. Authentic taste!",
      product: "Tata Sampann Turmeric Powder 200g",
      rating: 5,
      likes: 19,
      comments: 7,
    },
    {
      user: { name: "Vikram", avatar: "/placeholder.svg?height=40&width=40", level: "Platinum" },
      time: "12 hours ago",
      content:
        "TrustLens helped me choose the best tea brand! The community ratings were spot on. Now enjoying perfect morning chai!",
      product: "Tata Tea Gold 1kg",
      rating: 4,
      likes: 33,
      comments: 11,
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
                    <span>+250 purchases influenced</span>
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
