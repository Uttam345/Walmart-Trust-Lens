import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scan } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to make smarter purchases?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join millions of shoppers who trust our community-driven insights to make better buying decisions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/scanner">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
              <Scan className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </Link>
          <Link href="/social">
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-600 hover:text-blue-600 px-8 py-3 text-lg font-medium"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
