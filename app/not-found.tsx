import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, Shield } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header without search functionality */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TrustLens</h1>
                <p className="text-xs text-gray-500">by Walmart</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 404 Content */}
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>

            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>

              <Link href="/scanner" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Try Scanner
                </Button>
              </Link>

              <Link href="/social" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Community
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Visit our{" "}
                <Link href="/" className="text-blue-600 hover:text-blue-700">
                  support center
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
