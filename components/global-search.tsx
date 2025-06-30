"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, Users, TrendingUp, MapPin, Clock, Filter, X, Sparkles, Crown } from "lucide-react"

interface SearchResult {
  id: string
  name: string
  price: string
  image: string
  category: string
  rating: number
  reviews: number
  socialProof: {
    friendsPurchased: number
    friendsRecommend: number
    locationPopularity: number
    userClassPreference: number
    trendingScore: number
    recentActivity: string
  }
  friends: {
    name: string
    avatar: string
    action: string
    timeAgo: string
  }[]
  sustainability: {
    ecoScore: number
    certifications: string[]
  }
}

interface GlobalSearchProps {
  userClassification: "VIP_FREQUENT" | "REGULAR_SHOPPER" | "CART_ABANDONER" | "OCCASIONAL_VISITOR"
  userLocation: { city: string; zipCode: string }
  isOpen: boolean
  onClose: () => void
}

function GlobalSearchContent({ userClassification, userLocation, isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "friends" | "trending" | "local" | "eco">("all")
  const [recentSearches, setRecentSearches] = useState<string[]>(["organic honey", "laundry detergent", "baby formula"])
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock search results with social proof data
  const mockSearchResults: SearchResult[] = [
    {
      id: "honey123",
      name: "Great Value Organic Honey",
      price: "$4.98",
      image: "/placeholder.svg?height=80&width=80",
      category: "Grocery",
      rating: 4.8,
      reviews: 2847,
      socialProof: {
        friendsPurchased: 3,
        friendsRecommend: 89,
        locationPopularity: 76,
        userClassPreference: 92,
        trendingScore: 85,
        recentActivity: "127 people scanned this in the last hour",
      },
      friends: [
        { name: "Emma W.", avatar: "/placeholder.svg?height=24&width=24", action: "bought", timeAgo: "2 days ago" },
        {
          name: "Mike R.",
          avatar: "/placeholder.svg?height=24&width=24",
          action: "recommended",
          timeAgo: "1 week ago",
        },
        { name: "Sarah L.", avatar: "/placeholder.svg?height=24&width=24", action: "reviewed", timeAgo: "3 days ago" },
      ],
      sustainability: {
        ecoScore: 88,
        certifications: ["Organic", "Non-GMO"],
      },
    },
    {
      id: "detergent456",
      name: "Tide Ultra Concentrated Detergent",
      price: "$12.97",
      image: "/placeholder.svg?height=80&width=80",
      category: "Household",
      rating: 4.6,
      reviews: 5234,
      socialProof: {
        friendsPurchased: 2,
        friendsRecommend: 94,
        locationPopularity: 82,
        userClassPreference: 87,
        trendingScore: 78,
        recentActivity: "89 people bought this after scanning",
      },
      friends: [
        { name: "Alex C.", avatar: "/placeholder.svg?height=24&width=24", action: "bought", timeAgo: "1 day ago" },
        {
          name: "Lisa M.",
          avatar: "/placeholder.svg?height=24&width=24",
          action: "added to cart",
          timeAgo: "4 hours ago",
        },
      ],
      sustainability: {
        ecoScore: 72,
        certifications: ["Concentrated Formula"],
      },
    },
    {
      id: "formula789",
      name: "Similac Pro-Advance Baby Formula",
      price: "$28.99",
      image: "/placeholder.svg?height=80&width=80",
      category: "Baby",
      rating: 4.7,
      reviews: 3456,
      socialProof: {
        friendsPurchased: 1,
        friendsRecommend: 96,
        locationPopularity: 91,
        userClassPreference: 94,
        trendingScore: 88,
        recentActivity: "Top choice for new parents in your area",
      },
      friends: [
        {
          name: "Jennifer K.",
          avatar: "/placeholder.svg?height=24&width=24",
          action: "subscribed",
          timeAgo: "1 week ago",
        },
      ],
      sustainability: {
        ecoScore: 65,
        certifications: ["Pediatrician Recommended"],
      },
    },
  ]

  // Simulate search with social proof ranking
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filter and rank results based on social proof and user classification
    let filteredResults = mockSearchResults.filter(
      (result) =>
        result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Apply social proof ranking based on user classification
    filteredResults = filteredResults
      .map((result) => ({
        ...result,
        socialScore: calculateSocialScore(result, userClassification),
      }))
      .sort((a, b) => (b as any).socialScore - (a as any).socialScore)

    // Apply active filter
    if (activeFilter === "friends") {
      filteredResults = filteredResults.filter((result) => result.friends.length > 0)
    } else if (activeFilter === "trending") {
      filteredResults = filteredResults.filter((result) => result.socialProof.trendingScore > 80)
    } else if (activeFilter === "local") {
      filteredResults = filteredResults.filter((result) => result.socialProof.locationPopularity > 75)
    } else if (activeFilter === "eco") {
      filteredResults = filteredResults.filter((result) => result.sustainability.ecoScore > 70)
    }

    setResults(filteredResults)
    setIsLoading(false)
  }

  // Calculate social proof score based on user classification
  const calculateSocialScore = (result: SearchResult, classification: string) => {
    let score = 0

    // Base score from rating and reviews
    score += result.rating * 10 + Math.log(result.reviews) * 5

    // Social proof multipliers based on user type
    if (classification === "VIP_FREQUENT") {
      score += result.socialProof.userClassPreference * 0.8
      score += result.socialProof.friendsRecommend * 0.6
    } else if (classification === "CART_ABANDONER") {
      score += result.socialProof.friendsPurchased * 15 // High weight on friend purchases
      score += result.socialProof.trendingScore * 0.7
    } else if (classification === "OCCASIONAL_VISITOR") {
      score += result.socialProof.locationPopularity * 0.8
      score += result.socialProof.trendingScore * 0.9
    } else {
      score += result.socialProof.userClassPreference * 0.7
      score += result.socialProof.locationPopularity * 0.5
    }

    return score
  }

  useEffect(() => {
    if (query) {
      performSearch(query)
    } else {
      setResults([])
    }
  }, [query, activeFilter])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div ref={searchRef} className="w-full max-w-4xl mx-4">
        <Card className="shadow-2xl">
          <CardContent className="p-0">
            {/* Search Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products with social proof..."
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Filters */}
              <div className="flex items-center space-x-2 mt-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex space-x-2">
                  {[
                    { key: "all", label: "All Results", icon: Search },
                    { key: "friends", label: "Friends", icon: Users },
                    { key: "trending", label: "Trending", icon: TrendingUp },
                    { key: "local", label: "Local", icon: MapPin },
                    { key: "eco", label: "Eco-Friendly", icon: Sparkles },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={activeFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.key as any)}
                      className="text-xs"
                    >
                      <filter.icon className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {!query && (
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(search)}
                        className="text-sm"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {search}
                      </Button>
                    ))}
                  </div>

                  {/* Personalized Suggestions */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      {userClassification === "VIP_FREQUENT" && <Crown className="w-4 h-4 mr-2 text-yellow-600" />}
                      Suggested for You
                    </h3>
                    <div className="space-y-2">
                      {userClassification === "VIP_FREQUENT" && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">Premium organic products trending in your area</p>
                        </div>
                      )}
                      {userClassification === "CART_ABANDONER" && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-800">Items your friends recently purchased</p>
                        </div>
                      )}
                      {userClassification === "OCCASIONAL_VISITOR" && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">Popular products in {userLocation.city}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Searching with social proof...</p>
                </div>
              )}

              {query && !isLoading && results.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-600">No results found for "{query}"</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="divide-y divide-gray-100">
                  {results.map((result) => (
                    <Link key={result.id} href={`/scanner?product=${result.id}`} onClick={onClose}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <img
                            src={result.image || "/placeholder.svg"}
                            alt={result.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 truncate">{result.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-lg font-bold text-blue-600">{result.price}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {result.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{result.rating}</span>
                                <span className="text-xs text-gray-500">({result.reviews.toLocaleString()})</span>
                              </div>
                            </div>

                            {/* Social Proof Indicators */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              {result.friends.length > 0 && (
                                <div className="flex items-center space-x-2">
                                  <div className="flex -space-x-1">
                                    {result.friends.slice(0, 3).map((friend, idx) => (
                                      <Avatar key={idx} className="w-5 h-5 border border-white">
                                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">
                                          {friend.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  <span className="text-xs text-blue-600 font-medium">
                                    {result.friends.length} friend{result.friends.length > 1 ? "s" : ""} interested
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-gray-600">
                                  {result.socialProof.locationPopularity}% local popularity
                                </span>
                              </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>{result.socialProof.recentActivity}</span>
                            </div>

                            {/* Friend Activity */}
                            {result.friends.length > 0 && (
                              <div className="mt-2 text-xs text-gray-600">
                                <span className="font-medium">{result.friends[0].name}</span> {result.friends[0].action}{" "}
                                this {result.friends[0].timeAgo}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search Footer */}
            {results.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Showing {results.length} results with social proof</span>
                  <Link href={`/scanner?q=${encodeURIComponent(query)}`} onClick={onClose}>
                    <Button variant="outline" size="sm">
                      View All Results
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function GlobalSearchFallback() {
  return null // Return null for search fallback since it's a modal
}

export function GlobalSearch(props: GlobalSearchProps) {
  return (
    <Suspense fallback={<GlobalSearchFallback />}>
      <GlobalSearchContent {...props} />
    </Suspense>
  )
}
