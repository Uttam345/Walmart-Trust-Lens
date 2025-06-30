import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Droplets, Zap } from "lucide-react"

export function EcoMetrics() {
  const metrics = [
    {
      icon: Leaf,
      title: "Carbon Saved",
      value: "127 lbs",
      change: "+23% this month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Recycle,
      title: "Recycled Products",
      value: "34",
      change: "12 this week",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Droplets,
      title: "Water Saved",
      value: "2,450 gal",
      change: "+18% this month",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Zap,
      title: "Energy Efficient",
      value: "89%",
      change: "of purchases",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{metric.title}</p>
              <p className="text-xs text-gray-500">{metric.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
