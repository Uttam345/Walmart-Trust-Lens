"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scan, Users, Leaf, Trophy, MessageCircle, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function HeaderContent() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navigationItems = [
    { href: "/", label: "Home", icon: null },
    { href: "/scanner", label: "Scanner", icon: Scan },
    { href: "/assistant", label: "AI Assistant", icon: MessageCircle },
    { href: "/social", label: "Community", icon: Users },
    { href: "/sustainability", label: "Eco Hub", icon: Leaf },
    { href: "/achievements", label: "Achievements", icon: Trophy },
  ]

  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">TrustLens</h1>
              <p className="text-xs text-gray-500 -mt-1">by Walmart</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">TrustLens</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-700">2,847k+ Points</span>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">GOLD</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 rounded-xl transition-all duration-200 hover:bg-blue-50",
                isMobileMenuOpen ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-600"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Modern Dropdown Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="lg:hidden absolute top-16 right-4 w-80 glass-effect rounded-2xl shadow-2xl border border-gray-100/50 z-50 overflow-hidden dropdown-enter">
              {/* Header Section */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">TrustLens Menu</h3>
                    <p className="text-xs text-gray-500">Navigate to any section</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="px-3 py-4 space-y-1">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium smooth-transition relative overflow-hidden hover-glow",
                      isActive(item.href)
                        ? "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md border border-blue-200/50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:shadow-sm"
                    )}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? 'slideInFromRight 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg smooth-transition",
                      isActive(item.href)
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    )}>
                      {item.icon ? <item.icon className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    
                    {/* Label */}
                    <span className="flex-1">{item.label}</span>
                    
                    {/* Active Indicator */}
                    {isActive(item.href) && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Hover Arrow */}
                    <div className={cn(
                      "opacity-0 group-hover:opacity-100 smooth-transition",
                      "text-blue-600 transform group-hover:translate-x-1"
                    )}>
                      →
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Divider */}
              <div className="mx-6 border-t border-gray-100"></div>
              
              {/* User Status Section */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100/50 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-sm font-semibold text-yellow-800">2,847k+ Points</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-200 px-3 py-1 rounded-full shadow-sm">
                      GOLD MEMBER
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 rounded-xl h-12 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In to Continue
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Close Menu
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function HeaderFallback() {
  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">TrustLens</h1>
              <p className="text-xs text-gray-500 -mt-1">by Walmart</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">TrustLens</h1>
            </div>
          </Link>

          {/* Simplified navigation without active states */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200">
              Home
            </Link>
            <Link
              href="/scanner"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center space-x-2"
            >
              <Scan className="w-4 h-4" />
              <span>Scanner</span>
            </Link>
            <Link
              href="/assistant"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/social"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
            <Link
              href="/sustainability"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center space-x-2"
            >
              <Leaf className="w-4 h-4" />
              <span>Eco Hub</span>
            </Link>
            <Link
              href="/achievements"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-700">2,847k+ Points</span>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">GOLD</span>
            </div>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-gray-50">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" className="p-2" disabled>
              <Menu className="w-5 h-5 text-gray-400" />
            </Button>
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
