import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Target } from "lucide-react"

export function CarbonTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <span>Carbon Footprint</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">127 kT</div>
            <div className="text-sm text-gray-600">CO₂ saved this month</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Goal</span>
              <span className="text-sm font-medium">150 kT</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <div className="text-xs text-gray-500 text-center">85% of goal achieved</div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>23 kT more to reach your goal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
