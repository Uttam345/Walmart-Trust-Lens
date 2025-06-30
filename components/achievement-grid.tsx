import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Scan, Users, Leaf, Trophy, Target, Lock } from "lucide-react"

export function AchievementGrid() {
  const achievements = [
    {
      id: 1,
      title: "First Scan",
      description: "Complete your first product scan",
      icon: Scan,
      earned: true,
      progress: 100,
      points: 50,
      category: "Scanner",
    },
    {
      id: 2,
      title: "Review Master",
      description: "Write 10 helpful product reviews",
      icon: Star,
      earned: true,
      progress: 100,
      points: 200,
      category: "Community",
    },
    {
      id: 3,
      title: "Eco Warrior",
      description: "Purchase 25 eco-friendly products",
      icon: Leaf,
      earned: false,
      progress: 68,
      points: 300,
      category: "Sustainability",
    },
    {
      id: 4,
      title: "Social Butterfly",
      description: "Get 100 likes on your reviews",
      icon: Users,
      earned: false,
      progress: 45,
      points: 150,
      category: "Social",
    },
    {
      id: 5,
      title: "Scan Streak",
      description: "Scan products for 7 consecutive days",
      icon: Target,
      earned: false,
      progress: 57,
      points: 250,
      category: "Scanner",
    },
    {
      id: 6,
      title: "Champion",
      description: "Reach the top 10 on leaderboard",
      icon: Trophy,
      earned: false,
      progress: 0,
      points: 500,
      category: "Achievement",
      locked: true,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Scanner":
        return "bg-blue-100 text-blue-800"
      case "Community":
        return "bg-purple-100 text-purple-800"
      case "Sustainability":
        return "bg-green-100 text-green-800"
      case "Social":
        return "bg-pink-100 text-pink-800"
      case "Achievement":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`relative ${achievement.earned ? "ring-2 ring-yellow-400" : ""}`}>
            <CardContent className="p-6">
              {achievement.locked && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${achievement.earned ? "bg-yellow-100" : "bg-gray-100"} flex items-center justify-center`}
                >
                  <achievement.icon className={`w-6 h-6 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

              <div className="space-y-3">
                <Badge variant="secondary" className={getCategoryColor(achievement.category)}>
                  {achievement.category}
                </Badge>

                {!achievement.earned && !achievement.locked && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reward</span>
                  <span className="font-semibold text-blue-600">{achievement.points} pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
