"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, DollarSign, Calendar, Package } from "lucide-react"

interface ShoppingPreferencesStepProps {
  onNext: (data: { shoppingFrequency: string; avgSpending: string; categories: string[] }) => void
  onPrevious: () => void
  isFirst: boolean
}

export function ShoppingPreferencesStep({ onNext, onPrevious, isFirst }: ShoppingPreferencesStepProps) {
  const [frequency, setFrequency] = useState("")
  const [spending, setSpending] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const frequencies = [
    { value: "weekly", label: "Weekly", icon: Calendar, description: "I shop every week" },
    { value: "biweekly", label: "Bi-weekly", icon: Calendar, description: "Every 2 weeks" },
    { value: "monthly", label: "Monthly", icon: Calendar, description: "Once a month" },
    { value: "occasional", label: "Occasionally", icon: Calendar, description: "When needed" },
  ]

  const spendingRanges = [
    { value: "under-50", label: "Under $50", icon: DollarSign },
    { value: "50-100", label: "$50 - $100", icon: DollarSign },
    { value: "100-200", label: "$100 - $200", icon: DollarSign },
    { value: "over-200", label: "Over $200", icon: DollarSign },
  ]

  const categories = [
    "Groceries",
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Health & Beauty",
    "Baby & Kids",
    "Sports & Outdoors",
    "Automotive",
    "Books & Media",
    "Pet Supplies",
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const canProceed = frequency && spending && selectedCategories.length > 0

  const handleNext = () => {
    if (canProceed) {
      // Create a clean data object with only primitive values
      const cleanData = {
        shoppingFrequency: frequency,
        avgSpending: spending,
        categories: [...selectedCategories], // Create new array
      }

      onNext(cleanData)
    }
  }

  const handlePrevious = () => {
    onPrevious()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tell Us About Your Shopping</h3>
        <p className="text-gray-600">This helps us personalize your social proof experience</p>
      </div>

      {/* Shopping Frequency */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">How often do you shop at Walmart?</h4>
        <div className="grid grid-cols-2 gap-3">
          {frequencies.map((freq) => (
            <Card
              key={freq.value}
              className={`cursor-pointer transition-all ${
                frequency === freq.value ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setFrequency(freq.value)}
            >
              <CardContent className="p-4 text-center">
                <freq.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="font-medium text-gray-900">{freq.label}</div>
                <div className="text-sm text-gray-600">{freq.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Average Spending */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Average spending per trip?</h4>
        <div className="grid grid-cols-2 gap-3">
          {spendingRanges.map((range) => (
            <Card
              key={range.value}
              className={`cursor-pointer transition-all ${
                spending === range.value ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSpending(range.value)}
            >
              <CardContent className="p-4 text-center">
                <range.icon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium text-gray-900">{range.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">What do you usually buy? (Select all that apply)</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-2 ${
                selectedCategories.includes(category)
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-purple-50 hover:border-purple-300"
              }`}
              onClick={() => toggleCategory(category)}
            >
              <Package className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Selected: {selectedCategories.length} categories</p>
      </div>

      <div className="flex space-x-3 pt-4">
        {!isFirst && (
          <Button onClick={handlePrevious} variant="outline" className="flex-1">
            Previous
          </Button>
        )}
        <Button onClick={handleNext} disabled={!canProceed} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </div>
  )
}
