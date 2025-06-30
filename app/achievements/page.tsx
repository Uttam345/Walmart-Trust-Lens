import { Header } from "@/components/header"
import { AchievementGrid } from "@/components/achievement-grid"
import { ProgressStats } from "@/components/progress-stats"
import { Leaderboard } from "@/components/leaderboard"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Track your progress and unlock rewards</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <ProgressStats />
            <AchievementGrid />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}
