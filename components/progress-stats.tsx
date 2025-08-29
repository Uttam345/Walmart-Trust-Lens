import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Target, TrendingUp } from "lucide-react"

export function ProgressStats() {
  const stats = [
    {
      icon: Trophy,
      title: "Total Points",
      value: "1,557",
      change: "+127 this week",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Star,
      title: "Achievements",
      value: "12/24",
      change: "2 unlocked recently",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Target,
      title: "Current Level",
      value: "Gold",
      change: "87% to Platinum",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Rank",
      value: "#156",
      change: "↑12 positions",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
