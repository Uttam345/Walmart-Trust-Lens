import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Star, TrendingUp } from "lucide-react"

export function CommunityStats() {
  const stats = [
    { icon: Users, label: "Active Members", value: "2.8M", color: "text-blue-600" },
    { icon: MessageSquare, label: "Reviews Today", value: "15.2K", color: "text-green-600" },
    { icon: Star, label: "Avg Rating", value: "4.3", color: "text-yellow-600" },
    { icon: TrendingUp, label: "Growth", value: "+12%", color: "text-purple-600" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="font-semibold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
