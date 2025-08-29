import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Leaf, Recycle, Droplets } from "lucide-react"

export function EcoTips() {
  const tips = [
    {
      icon: Leaf,
      title: "Choose Organic",
      description: "Look for FSAAI Organic certified products to reduce pesticide impact.",
    },
    {
      icon: Recycle,
      title: "Buy Recycled",
      description: "Products made from recycled materials help reduce waste.",
    },
    {
      icon: Droplets,
      title: "Water Efficient",
      description: "Select WaterSense labeled products to conserve water.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <span>Eco Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <tip.icon className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{tip.title}</h4>
                <p className="text-xs text-gray-600">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
