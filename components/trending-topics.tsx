import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, TrendingUp } from "lucide-react"

export function TrendingTopics() {
  const topics = [
    { tag: "OrganicFood", posts: "1.2K posts" },
    { tag: "BackToSchool", posts: "856 posts" },
    { tag: "EcoFriendly", posts: "743 posts" },
    { tag: "BudgetFinds", posts: "621 posts" },
    { tag: "HealthyLiving", posts: "589 posts" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Trending Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{topic.tag}</span>
              </div>
              <span className="text-xs text-gray-500">{topic.posts}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
