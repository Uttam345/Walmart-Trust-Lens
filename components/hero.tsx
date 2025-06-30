import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scan, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Scan className="w-4 h-4" />
            <span>Social Proof Scanner</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Make smarter purchases with <span className="text-blue-600">community wisdom</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Scan any product and instantly access real reviews, community ratings, and social validation from millions
            of Walmart shoppers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Link href="/scanner">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
                <Scan className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            </Link>
            <Link href="/social">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50 px-8 py-3 text-lg font-medium"
              >
                <Users className="w-5 h-5 mr-2" />
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
