import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Leaf, Star, ArrowRight } from "lucide-react"

export function CommunityImpact() {
  const impactStats = [
    {
      icon: Users,
      title: "Community Driven",
      value: "2.8M+",
      description: "Active shoppers sharing insights",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/social",
    },
    {
      icon: TrendingUp,
      title: "Sales Influenced",
      value: "$127M+",
      description: "In community-driven purchases",
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/achievements",
    },
    {
      icon: Leaf,
      title: "Eco Impact",
      value: "45K lbs",
      description: "CO₂ saved through smart choices",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      link: "/sustainability",
    },
    {
      icon: Star,
      title: "Trust Score",
      value: "96%",
      description: "Users trust community recommendations",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/social",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Community Intelligence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our community of millions creates a powerful network effect that drives better shopping decisions and
            sustainable choices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, index) => (
            <Link key={index} href={stat.link}>
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="font-semibold text-gray-900 mb-2">{stat.title}</div>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Movement: Shop Smarter, Impact Greater</h3>
              <p className="text-gray-600 mb-6">
                Every scan, review, and purchase contributes to a growing network of informed shoppers making better
                choices for themselves and the planet.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Real-time social validation on every product</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Community-driven sustainability insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Peer recommendations that drive sales</span>
                </div>
              </div>
              <Link href="/scanner">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Your Impact Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">Real Impact</div>
                  <p className="text-gray-600 mb-4">See how your choices matter</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Link href="/achievements">
                      <div className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="font-semibold text-gray-900">This Week</div>
                        <div className="text-blue-600">+2,847 scans</div>
                      </div>
                    </Link>
                    <Link href="/sustainability">
                      <div className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="font-semibold text-gray-900">Eco Savings</div>
                        <div className="text-green-600">127 lbs CO₂</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
