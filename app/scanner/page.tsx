import { Header } from "@/components/header"
import { UserClassificationSystem } from "@/components/user-classification-system"
import { EnhancedScannerInterface } from "@/components/enhanced-scanner-interface"
import { PersonalizedExperience } from "@/components/personalized-experience"
import { RecentScans } from "@/components/recent-scans"

export default function ScannerPage() {
  const mockUserData = {
    userId: "user123",
    classification: "VIP_FREQUENT" as const,
    cartAbandonmentRate: 0.15,
    avgOrderValue: 127.5,
    loyaltyScore: 92,
    location: { city: "Austin", zipCode: "78701" },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Social Proof Scanner</h1>
          <p className="text-gray-600">
            Scan products and see what your friends, neighbors, and similar shoppers think
          </p>
        </div>

        <UserClassificationSystem userId={mockUserData.userId} />

        <div className="mb-8">
          <PersonalizedExperience
            userClassification={mockUserData.classification}
            cartAbandonmentRate={mockUserData.cartAbandonmentRate}
            avgOrderValue={mockUserData.avgOrderValue}
            loyaltyScore={mockUserData.loyaltyScore}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EnhancedScannerInterface />
          </div>
          <div>
            <RecentScans />
          </div>
        </div>
      </div>
    </div>
  )
}
