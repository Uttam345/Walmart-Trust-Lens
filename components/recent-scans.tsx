import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"

export function RecentScans() {
  const recentScans = [
    {
      name: "Tide Laundry Detergent",
      rating: 4.3,
      time: "2 hours ago",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Cheerios Cereal",
      rating: 4.7,
      time: "1 day ago",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Coca-Cola 12 Pack",
      rating: 4.1,
      time: "2 days ago",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Scans</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentScans.map((scan, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <img
                src={scan.image || "/placeholder.svg"}
                alt={scan.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{scan.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{scan.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{scan.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
