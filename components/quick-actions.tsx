import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, TrendingUp, DollarSign, Star, Zap } from "lucide-react"

export function QuickActions() {
  const actions = [
    { icon: ShoppingCart, label: "Find Best Deals", color: "text-green-600", link: "/scanner" },
    { icon: Heart, label: "Wishlist Items", color: "text-red-500", link: "/social" },
    { icon: TrendingUp, label: "Trending Products", color: "text-blue-600", link: "/social" },
    { icon: DollarSign, label: "Price Comparison", color: "text-yellow-600", link: "/scanner" },
    { icon: Star, label: "Top Rated", color: "text-purple-600", link: "/achievements" },
    { icon: Zap, label: "Quick Reorder", color: "text-orange-600", link: "/scanner" },
  ]

  const popularQueries = [
    { query: "Best organic foods under $20", link: "/scanner?category=organic" },
    { query: "Highest rated electronics", link: "/scanner?category=electronics" },
    { query: "Eco-friendly cleaning products", link: "/sustainability" },
    { query: "Baby products with 5-star reviews", link: "/scanner?category=baby" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action, index) => (
              <Link key={index} href={action.link}>
                <Button variant="outline" className="justify-start h-auto p-4 hover:bg-gray-50 w-full">
                  <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {popularQueries.map((item, index) => (
              <Link key={index} href={item.link}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  {item.query}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
