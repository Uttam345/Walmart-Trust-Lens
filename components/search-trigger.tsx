"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { GlobalSearch } from "./global-search"

interface SearchTriggerProps {
  userClassification?: "VIP_FREQUENT" | "REGULAR_SHOPPER" | "CART_ABANDONER" | "OCCASIONAL_VISITOR"
  userLocation?: { city: string; zipCode: string }
  variant?: "button" | "input"
  className?: string
}

function SearchTriggerContent({
  userClassification = "REGULAR_SHOPPER",
  userLocation = { city: "Austin", zipCode: "78701" },
  variant = "button",
  className = "",
}: SearchTriggerProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  if (variant === "input") {
    return (
      <>
        <div className={`relative cursor-pointer ${className}`} onClick={() => setIsSearchOpen(true)}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <div className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            Search products with social proof...
          </div>
        </div>
        <GlobalSearch
          userClassification={userClassification}
          userLocation={userLocation}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsSearchOpen(true)}
        className={`bg-white text-gray-700 border-gray-200 hover:bg-gray-50 ${className}`}
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
      <GlobalSearch
        userClassification={userClassification}
        userLocation={userLocation}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}

function SearchTriggerFallback({
  variant = "button",
  className = "",
}: Pick<SearchTriggerProps, "variant" | "className">) {
  if (variant === "input") {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <div className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
          Search products with social proof...
        </div>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" disabled className={`bg-white text-gray-700 border-gray-200 ${className}`}>
      <Search className="w-4 h-4 mr-2" />
      Search
    </Button>
  )
}

export function SearchTrigger(props: SearchTriggerProps) {
  return (
    <Suspense fallback={<SearchTriggerFallback variant={props.variant} className={props.className} />}>
      <SearchTriggerContent {...props} />
    </Suspense>
  )
}
