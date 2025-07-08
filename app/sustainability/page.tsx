import { Header } from "@/components/header"
import { EcoMetrics } from "@/components/eco-metrics"
import { EcoTips } from "@/components/eco-tips"
import { CarbonTracker } from "@/components/carbon-tracker"
import { EcoScanner } from "@/components/eco-scanner-simple"

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainability Hub</h1>
          <p className="text-gray-600">Make eco-friendly choices and track your environmental impact</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EcoMetrics />
            <EcoScanner />
          </div>
          <div className="space-y-6">
            <CarbonTracker />
            <EcoTips />
          </div>
        </div>
      </div>
    </div>
  )
}
