"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scan, Users, Leaf, Trophy, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchTrigger } from "./search-trigger"

function HeaderContent() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SmartScan</h1>
              <p className="text-xs text-gray-500">by Walmart</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/scanner"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/scanner") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Scanner</span>
            </Link>
            <Link
              href="/assistant"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/assistant") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/social"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/social") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
            <Link
              href="/sustainability"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/sustainability") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>Eco Hub</span>
            </Link>
            <Link
              href="/achievements"
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/achievements") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Global Search */}
            <div className="hidden sm:block">
              <SearchTrigger userClassification="VIP_FREQUENT" userLocation={{ city: "Austin", zipCode: "78701" }} />
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">2,847k+ Points</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-yellow-600 font-medium">Gold</span>
            </div>
            <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50">
              Sign In
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <SearchTrigger
            variant="input"
            className="w-full"
            userClassification="VIP_FREQUENT"
            userLocation={{ city: "Austin", zipCode: "78701" }}
          />
        </div>
      </div>
    </header>
  )
}

function HeaderFallback() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SmartScan</h1>
              <p className="text-xs text-gray-500">by Walmart</p>
            </div>
          </Link>

          {/* Simplified navigation without active states */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link
              href="/scanner"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Scan className="w-4 h-4" />
              <span>Scanner</span>
            </Link>
            <Link
              href="/assistant"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/social"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
            <Link
              href="/sustainability"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Leaf className="w-4 h-4" />
              <span>Eco Hub</span>
            </Link>
            <Link
              href="/achievements"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Disabled search for fallback */}
            <div className="hidden sm:block">
              <Button variant="outline" size="sm" disabled className="bg-white text-gray-700 border-gray-200">
                Search
              </Button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">2,847k+ Points</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-yellow-600 font-medium">Gold</span>
            </div>
            <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50">
              Sign In
            </Button>
          </div>
        </div>

        {/* Mobile search fallback */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <div className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
              Search products with social proof...
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  )
}
