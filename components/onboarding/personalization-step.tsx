"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { User, Leaf, Home } from "lucide-react"

interface PersonalizationStepProps {
  onNext: (data: { name: string; age: string; householdSize: string; sustainabilityImportance: number }) => void
  onPrevious: () => void
  onSkip: () => void
  canSkip: boolean
}

export function PersonalizationStep({ onNext, onPrevious, onSkip, canSkip }: PersonalizationStepProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [householdSize, setHouseholdSize] = useState("")
  const [sustainabilityImportance, setSustainabilityImportance] = useState([5])

  const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
  const householdSizes = ["1", "2", "3", "4", "5+"]

  const handleNext = () => {
    // Create clean data object with only primitive values
    const cleanData = {
      name: name,
      age: age,
      householdSize: householdSize,
      sustainabilityImportance: sustainabilityImportance[0],
    }

    onNext(cleanData)
  }

  const handlePrevious = () => {
    onPrevious()
  }

  const handleSkipClick = () => {
    onSkip()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Personalize Your Experience</h3>
        <p className="text-gray-600">Help us tailor recommendations just for you</p>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-gray-900">
          What should we call you? (Optional)
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your first name"
          className="mt-1"
        />
      </div>

      {/* Age Range */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-3 block">Age Range</Label>
        <div className="grid grid-cols-3 gap-2">
          {ageRanges.map((range) => (
            <Card
              key={range}
              className={`cursor-pointer transition-all ${
                age === range ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setAge(range)}
            >
              <CardContent className="p-3 text-center">
                <div className="font-medium text-gray-900">{range}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Household Size */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Home className="w-4 h-4 mr-2" />
          Household Size
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {householdSizes.map((size) => (
            <Card
              key={size}
              className={`cursor-pointer transition-all ${
                householdSize === size ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setHouseholdSize(size)}
            >
              <CardContent className="p-3 text-center">
                <div className="font-medium text-gray-900">{size}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sustainability Importance */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Leaf className="w-4 h-4 mr-2 text-green-600" />
          How important is sustainability to you?
        </Label>
        <div className="px-3">
          <Slider
            value={sustainabilityImportance}
            onValueChange={setSustainabilityImportance}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Not important</span>
            <span className="font-medium text-green-600">{sustainabilityImportance[0]}/10</span>
            <span>Very important</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Why this helps:</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Get recommendations from similar shoppers</li>
          <li>• See products popular with your demographic</li>
          <li>• Discover eco-friendly alternatives when relevant</li>
        </ul>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          Previous
        </Button>
        <Button onClick={handleNext} className="flex-1 bg-purple-600 hover:bg-purple-700">
          Continue
        </Button>
      </div>

      {canSkip && (
        <div className="text-center">
          <Button onClick={handleSkipClick} variant="ghost" size="sm" className="text-gray-500">
            Skip personalization
          </Button>
        </div>
      )}
    </div>
  )
}
