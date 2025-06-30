import { Header } from "@/components/header"
import { SocialFeed } from "@/components/social-feed"
import { TrendingTopics } from "@/components/trending-topics"
import { CommunityStats } from "@/components/community-stats"

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with fellow shoppers and share your experiences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <SocialFeed />
          </div>
          <div className="space-y-6">
            <CommunityStats />
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  )
}
