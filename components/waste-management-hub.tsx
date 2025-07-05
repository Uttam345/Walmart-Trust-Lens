"use client"

import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { 
  Upload, 
  Camera, 
  MapPin, 
  Recycle, 
  Trash2, 
  TreePine, 
  Battery, 
  Shirt, 
  Smartphone,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Navigation,
  Star,
  Phone,
  Clock,
  Loader2,
  Gift
} from "lucide-react"
import { getCurrentLocation } from "../lib/location-utils"

interface WasteItem {
  id: string
  name: string
  type: string
  category: "recyclable" | "hazardous" | "compostable" | "general" | "donate" | "reuse"
  condition?: "excellent" | "good" | "fair" | "poor" | "hazardous"
  confidence?: number
  disposalMethod: string
  environmentalImpact: string
  nearbyLocations: string[]
  tips: string[]
  recommendations?: string[]
}

interface DropOffLocation {
  id?: string
  name: string
  address: string
  distance: string
  acceptedWaste?: string[]
  acceptedItems?: string[]
  hours: string
  phone?: string
  rating?: number
  type?: string
}

interface EcoScanResult {
  itemName: string
  category: 'donate' | 'recycle' | 'waste' | 'reuse' | 'hazardous'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous'
  confidence: number
  analysis: string
  recommendations: string[]
  environmentalImpact: string
  disposalMethod: string
  tips: string[]
}

const mockWasteDatabase: Record<string, WasteItem> = {
  "battery": {
    id: "battery",
    name: "Battery",
    type: "Lithium Ion Battery",
    category: "hazardous",
    disposalMethod: "Special collection at electronics stores or hazardous waste facilities",
    environmentalImpact: "Contains toxic materials that can contaminate soil and water if disposed improperly",
    nearbyLocations: ["Best Buy - Electronics Recycling", "Home Depot - Battery Collection", "City Hazardous Waste Center"],
    tips: ["Never throw batteries in regular trash", "Remove batteries from devices before disposal", "Store used batteries in a cool, dry place until disposal"]
  },
  "clothing": {
    id: "clothing",
    name: "Old Clothing",
    type: "Textile Waste",
    category: "recyclable",
    disposalMethod: "Donate to charity, textile recycling, or upcycle",
    environmentalImpact: "Textile waste contributes to landfill overflow. Donating extends product lifecycle",
    nearbyLocations: ["Goodwill Donation Center", "H&M Textile Recycling", "Local Community Center"],
    tips: ["Wash items before donating", "Consider upcycling torn items", "Separate by material type for better recycling"]
  },
  "phone": {
    id: "phone",
    name: "Smartphone",
    type: "Electronic Waste",
    category: "hazardous",
    disposalMethod: "Manufacturer take-back programs or certified e-waste recyclers",
    environmentalImpact: "Contains rare earth metals and toxic materials requiring specialized processing",
    nearbyLocations: ["Apple Store - Trade-in Program", "Staples - Tech Recycling", "Certified E-Waste Facility"],
    tips: ["Backup and wipe all personal data", "Remove SIM and memory cards", "Check manufacturer trade-in value"]
  },
  "food_waste": {
    id: "food_waste",
    name: "Food Scraps",
    type: "Organic Waste",
    category: "compostable",
    disposalMethod: "Home composting or municipal organic waste collection",
    environmentalImpact: "Produces methane in landfills. Composting creates valuable soil amendment",
    nearbyLocations: ["City Composting Program", "Community Garden Compost", "Local Farm Compost Drop-off"],
    tips: ["Separate vegetable scraps from meat/dairy", "Start a home compost bin", "Reduce food waste through meal planning"]
  }
}

const mockDropOffLocations: DropOffLocation[] = [
  {
    id: "1",
    name: "Best Buy Electronics Recycling",
    address: "123 Tech Ave, Downtown",
    distance: "0.8 miles",
    acceptedWaste: ["Electronics", "Batteries", "Cables"],
    hours: "Mon-Sat 10AM-8PM, Sun 11AM-6PM",
    phone: "(555) 123-4567"
  },
  {
    id: "2",
    name: "City Recycling Center",
    address: "456 Green St, Midtown",
    distance: "1.2 miles",
    acceptedWaste: ["General Recycling", "Cardboard", "Glass", "Metal"],
    hours: "Mon-Fri 8AM-5PM, Sat 9AM-3PM"
  },
  {
    id: "3",
    name: "Goodwill Donation Center",
    address: "789 Charity Ln, Westside",
    distance: "1.5 miles",
    acceptedWaste: ["Clothing", "Furniture", "Household Items"],
    hours: "Daily 9AM-7PM",
    phone: "(555) 987-6543"
  },
  {
    id: "4",
    name: "Municipal Hazardous Waste Facility",
    address: "321 Safe Disposal Rd, Industrial Zone",
    distance: "3.2 miles",
    acceptedWaste: ["Batteries", "Paint", "Chemicals", "Electronics"],
    hours: "Sat 8AM-2PM (Appointment Required)",
    phone: "(555) 456-7890"
  }
]

export function EcoScanner() {
  const [selectedWaste, setSelectedWaste] = useState<WasteItem | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [wasteInput, setWasteInput] = useState("")
  const [showDropOffLocations, setShowDropOffLocations] = useState(false)
  const [nearbyLocations, setNearbyLocations] = useState<DropOffLocation[]>([])
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Analyze with AI
      await analyzeWasteWithAI(file)
    }
  }

  const analyzeWasteWithAI = async (file: File) => {
    setIsAnalyzing(true)
    
    try {
      // Get user location for nearby places
      let location = userLocation
      if (!location) {
        try {
          const position = await getCurrentLocation()
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setUserLocation(location)
          setLocationError(null)
        } catch (error) {
          console.warn('Could not get location:', error)
          setLocationError('Location access denied. Manual location search available.')
        }
      }

      const formData = new FormData()
      formData.append('image', file)
      if (location) {
        formData.append('location', JSON.stringify(location))
      }

      const response = await fetch('/api/eco-scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      
      if (data.success) {
        const result: EcoScanResult = data.result
        
        // Convert AI result to WasteItem format
        const wasteItem: WasteItem = {
          id: result.itemName.toLowerCase().replace(/\s+/g, '_'),
          name: result.itemName,
          type: result.analysis,
          category: result.category === 'waste' ? 'general' : 
                   result.category === 'recycle' ? 'recyclable' :
                   result.category === 'hazardous' ? 'hazardous' :
                   result.category,
          condition: result.condition,
          confidence: result.confidence,
          disposalMethod: result.disposalMethod,
          environmentalImpact: result.environmentalImpact,
          nearbyLocations: [],
          tips: result.tips,
          recommendations: result.recommendations
        }
        
        setSelectedWaste(wasteItem)
        
        if (data.nearbyLocations && data.nearbyLocations.length > 0) {
          setNearbyLocations(data.nearbyLocations)
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('AI Analysis Error:', error)
      // Fallback to manual analysis
      analyzeWaste(file.name)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeWaste = (input: string) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const wasteKey = Object.keys(mockWasteDatabase).find(key => 
        input.toLowerCase().includes(key) || 
        mockWasteDatabase[key].name.toLowerCase().includes(input.toLowerCase())
      )
      
      if (wasteKey) {
        setSelectedWaste(mockWasteDatabase[wasteKey])
      } else {
        // Default to general waste if not found
        setSelectedWaste({
          id: "unknown",
          name: input || "Unknown Item",
          type: "General Waste",
          category: "general",
          disposalMethod: "Check local waste management guidelines or contact waste management services",
          environmentalImpact: "Proper disposal helps reduce environmental impact",
          nearbyLocations: ["Local Waste Management Center", "Municipal Dump"],
          tips: ["Contact local waste management for guidance", "Consider if item can be reused or donated"]
        })
      }
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleManualInput = () => {
    if (wasteInput.trim()) {
      analyzeWaste(wasteInput)
      setWasteInput("")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "recyclable": return "bg-green-100 text-green-800"
      case "hazardous": return "bg-red-100 text-red-800"
      case "compostable": return "bg-yellow-100 text-yellow-800"
      case "donate": return "bg-blue-100 text-blue-800"
      case "reuse": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "recyclable": return <Recycle className="w-4 h-4" />
      case "hazardous": return <AlertTriangle className="w-4 h-4" />
      case "compostable": return <TreePine className="w-4 h-4" />
      case "donate": return <Gift className="w-4 h-4" />
      case "reuse": return <Recycle className="w-4 h-4" />
      default: return <Trash2 className="w-4 h-4" />
    }
  }

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "excellent": return "bg-green-100 text-green-800"
      case "good": return "bg-blue-100 text-blue-800"
      case "fair": return "bg-yellow-100 text-yellow-800"
      case "poor": return "bg-orange-100 text-orange-800"
      case "hazardous": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
            <Recycle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Eco Scanner
            </h1>
            <p className="text-gray-600">AI-powered waste analysis & disposal guidance</p>
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="w-6 h-6" />
            Smart Item Analysis
          </CardTitle>
          <p className="text-green-100">Upload a photo or describe your item for instant disposal guidance</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Upload and Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Photo Analysis</h3>
                <Badge variant="secondary" className="text-xs">AI Powered</Badge>
              </div>
              <div className="relative border-2 border-dashed border-green-200 rounded-xl p-6 text-center hover:border-green-300 transition-colors bg-gradient-to-br from-green-50 to-emerald-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded item" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-green-200"
                    />
                    <Button 
                      onClick={() => {
                        setUploadedImage(null)
                        setSelectedWaste(null)
                      }}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Take or upload a photo</p>
                      <p className="text-sm text-gray-500 mb-3">Get instant AI analysis of your item</p>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Choose Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Text Description</h3>
                <Badge variant="secondary" className="text-xs">Quick Option</Badge>
              </div>
              <div className="space-y-3 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50">
                <textarea
                  placeholder="Describe your item... e.g., 'old smartphone with cracked screen', 'cotton t-shirt in good condition', 'empty plastic water bottle'"
                  value={wasteInput}
                  onChange={(e) => setWasteInput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <Button 
                  onClick={handleManualInput}
                  className="w-full bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-md"
                  disabled={!wasteInput.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Analyze Item
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Action Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Recycle className="w-5 h-5 text-purple-600" />
              Common Items
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(mockWasteDatabase).map(([key, item]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWaste(item)}
                  className="h-auto p-3 flex flex-col items-center gap-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {key === "battery" && <Battery className="w-4 h-4 text-yellow-600" />}
                    {key === "clothing" && <Shirt className="w-4 h-4 text-blue-600" />}
                    {key === "phone" && <Smartphone className="w-4 h-4 text-gray-600" />}
                    {key === "food_waste" && <TreePine className="w-4 h-4 text-green-600" />}
                  </div>
                  <span className="text-xs font-medium text-center">{item.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Analysis Loading */}
          {isAnalyzing && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  <div className="absolute inset-0 w-8 h-8 border-2 border-green-200 rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold text-green-800">Analyzing with AI...</div>
                  <div className="text-sm text-green-600">Claude 3.5 Sonnet is examining your item</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-green-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </div>
          )}

          {/* Location Status */}
          {locationError && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Location Services</h4>
                  <p className="text-sm text-yellow-700">{locationError}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {selectedWaste && (
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="w-6 h-6" />
              Analysis Complete
            </CardTitle>
            <p className="text-emerald-100">Your item has been analyzed and categorized</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Item Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(selectedWaste.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900">{selectedWaste.name}</h3>
                    <Badge className={`${getCategoryColor(selectedWaste.category)} flex items-center gap-1 text-sm px-3 py-1`}>
                      {getCategoryIcon(selectedWaste.category)}
                      {selectedWaste.category.charAt(0).toUpperCase() + selectedWaste.category.slice(1)}
                    </Badge>
                    {selectedWaste.condition && (
                      <Badge className={`${getConditionColor(selectedWaste.condition)} flex items-center gap-1 text-sm px-3 py-1`}>
                        <Info className="w-3 h-3" />
                        {selectedWaste.condition.charAt(0).toUpperCase() + selectedWaste.condition.slice(1)}
                      </Badge>
                    )}
                    {selectedWaste.confidence && (
                      <Badge variant="outline" className="text-sm px-3 py-1 border-green-300 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {Math.round(selectedWaste.confidence * 100)}% confident
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedWaste.type}</p>
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-800">
                    <Info className="w-5 h-5" />
                    Best Disposal Method
                  </h4>
                  <p className="text-blue-700 leading-relaxed">{selectedWaste.disposalMethod}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-800">
                    <TreePine className="w-5 h-5" />
                    Environmental Impact
                  </h4>
                  <p className="text-green-700 leading-relaxed">{selectedWaste.environmentalImpact}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* AI Recommendations */}
                {selectedWaste.recommendations && selectedWaste.recommendations.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-purple-800">
                      <Smartphone className="w-5 h-5" />
                      AI Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {selectedWaste.recommendations.map((rec, index) => (
                        <li key={index} className="text-purple-700 flex items-start gap-2 text-sm">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disposal Tips */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-800">
                    <Gift className="w-5 h-5" />
                    Preparation Tips
                  </h4>
                  <ul className="space-y-2">
                    {selectedWaste.tips.map((tip, index) => (
                      <li key={index} className="text-orange-700 flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <Dialog open={showDropOffLocations} onOpenChange={setShowDropOffLocations}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg flex-1 min-w-fit"
                    onClick={() => {
                      if (nearbyLocations.length === 0) {
                        setNearbyLocations(mockDropOffLocations)
                      }
                    }}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Nearby Locations
                    {nearbyLocations.length > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-white text-blue-600">
                        {nearbyLocations.length} found
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span>Disposal Locations</span>
                        {userLocation && (
                          <Badge variant="outline" className="ml-3 text-xs">
                            <Navigation className="w-3 h-3 mr-1" />
                            Near your location
                          </Badge>
                        )}
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {nearbyLocations.map((location, index) => (
                      <Card key={location.id || index} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{location.name}</h3>
                                <p className="text-gray-600 text-sm">
                                  {location.type
                                    ? location.type.charAt(0).toUpperCase() + location.type.slice(1)
                                    : 'Disposal Facility'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-sm">
                                <Navigation className="w-3 h-3 mr-1" />
                                {location.distance}
                              </Badge>
                              {location.rating && (
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium text-yellow-700">{location.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{location.address}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{location.hours}</span>
                              </div>
                              {location.phone && (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Phone className="w-4 h-4" />
                                  <span className="text-sm font-medium">{location.phone}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Accepted Items:</h5>
                              <div className="flex flex-wrap gap-1">
                                {(location.acceptedWaste || location.acceptedItems || []).map((item) => (
                                  <Badge key={item} variant="secondary" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Button size="sm" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {nearbyLocations.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No locations found</h3>
                        <p className="text-gray-500 text-sm">Try enabling location services or contact local waste management.</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectedWaste(null)
                  setUploadedImage(null)
                  setWasteInput("")
                }}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Another Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact Statistics */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            Your Environmental Impact
          </CardTitle>
          <p className="text-gray-600">Track your contribution to a sustainable future</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">23</div>
              <div className="text-sm text-gray-600">Items Recycled</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TreePine className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">45kg</div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Locations Visited</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-orange-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">89%</div>
              <div className="text-sm text-gray-600">Proper Disposal Rate</div>
            </div>
          </div>
          
          {/* Achievement Progress */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Next Achievement: Eco Warrior</span>
              <span className="text-xs text-green-600">7 more items</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '76%'}}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
