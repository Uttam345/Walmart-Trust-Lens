import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award } from "lucide-react"

export function Leaderboard() {
  const leaders = [
    {
      rank: 1,
      name: "Alex Chen",
      points: 15420,
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Platinum",
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      points: 14890,
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Platinum",
    },
    {
      rank: 3,
      name: "Mike Rodriguez",
      points: 13750,
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Gold",
    },
    {
      rank: 4,
      name: "Emma Wilson",
      points: 12340,
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Gold",
    },
    {
      rank: 5,
      name: "David Kim",
      points: 11890,
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Gold",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-gray-600">#{rank}</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaders.map((leader) => (
            <div key={leader.rank} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-center w-8">{getRankIcon(leader.rank)}</div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {leader.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{leader.name}</h4>
                    <p className="text-xs text-gray-500">{leader.level}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{leader.points.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center w-8">
              <span className="text-sm font-medium text-blue-600">#156</span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">Your Rank</h4>
                  <p className="text-xs text-blue-600">Gold Level</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">2,847</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
