import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scan, Leaf } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to revolutionize your shopping?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join the future of retail with social proof and sustainable shopping
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/scanner">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              <Scan className="w-5 h-5 mr-2" />
              Start Scanning
            </Button>
          </Link>
          <Link href="/sustainability">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-green-600 hover:bg-white hover:text-green-600 px-8 py-3 text-lg font-medium"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Go Green
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
