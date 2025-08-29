import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scan, Leaf, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Shop smarter with <span className="text-blue-600">social trust</span> and{" "}
            <span className="text-green-600">sustainability</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Scan products for instant social validation, earn green points for sustainable choices, 
            and make confident purchasing decisions with AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Link href="/scanner">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
                <Scan className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            </Link>
            <Link href="/sustainability">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium">
                <Leaf className="w-5 h-5 mr-2" />
                Go Green
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Products Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">2.5 kT</div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
