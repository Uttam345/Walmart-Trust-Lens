"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { 
  Recycle, 
  TreePine, 
  Camera,
  Info,
  Star
} from "lucide-react"
import { RealtimeEcoScanner } from "./realtime-eco-scanner"

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

export function EcoScanner() {
  const [selectedWaste, setSelectedWaste] = useState<WasteItem | null>(null)
  const [showRealtimeEcoScanner, setShowRealtimeEcoScanner] = useState(false)
  const [userStats, setUserStats] = useState({
    itemsScanned: 0,
    accurateAnalyses: 0,
    facilitiesFound: 0,
    totalProcessingTime: 0
  })

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
      case "hazardous": return <div className="w-4 h-4 text-red-500">⚠️</div>
      case "compostable": return <TreePine className="w-4 h-4" />
      case "donate": return <div className="w-4 h-4 text-blue-500">🎁</div>
      case "reuse": return <Recycle className="w-4 h-4" />
      default: return <div className="w-4 h-4">🗑️</div>
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
              Eco-Sustainability Scanner
            </h1>
            <p className="text-gray-600">Real-time AI analysis for proper waste disposal and environmental impact</p>
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="w-6 h-6" />
            Real-Time Eco Analysis
          </CardTitle>
          <p className="text-green-100">Point your camera at any item for instant disposal guidance</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Real-Time Eco Scanner Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <TreePine className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-lg">Real-Time Eco Scanner</h3>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">AI Powered</Badge>
            </div>
            
            <div className="p-6 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-sm text-gray-600 mb-4">
                    Point your camera at any item to get instant eco-friendly disposal recommendations
                  </div>
                  <div className="text-xs text-gray-400 mb-3 space-y-1">
                    <div>💡 Tips for best results:</div>
                    <div>• Good lighting and clear focus</div>
                    <div>• Fill the frame with your item</div>
                    <div>• Hold steady for analysis</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowRealtimeEcoScanner(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md text-lg py-4"
                  >
                    <TreePine className="w-5 h-5 mr-3" />
                    Start Real-Time Eco Scanner
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Scanning Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Photo Quality</span>
                </div>
                <p className="text-sm text-blue-700">Good lighting and clear focus for best AI analysis</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <TreePine className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Item Details</span>
                </div>
                <p className="text-sm text-green-700">Include labels, markings, and any damage in frame</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {selectedWaste && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(selectedWaste.category)}
                <span>{selectedWaste.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(selectedWaste.category)}>
                  {selectedWaste.category}
                </Badge>
                {selectedWaste.condition && (
                  <Badge className={getConditionColor(selectedWaste.condition)}>
                    {selectedWaste.condition}
                  </Badge>
                )}
                {selectedWaste.confidence && (
                  <Badge variant="secondary">
                    {selectedWaste.confidence}% confident
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
              <p className="text-gray-700">{selectedWaste.type}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Disposal Method</h4>
              <p className="text-gray-700">{selectedWaste.disposalMethod}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Environmental Impact</h4>
              <p className="text-gray-700">{selectedWaste.environmentalImpact}</p>
            </div>

            {selectedWaste.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedWaste.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedWaste.recommendations && selectedWaste.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedWaste.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700 text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{userStats.itemsScanned}</div>
              <div className="text-sm text-gray-600">Items Scanned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{userStats.accurateAnalyses}</div>
              <div className="text-sm text-gray-600">Accurate Analyses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{userStats.facilitiesFound}</div>
              <div className="text-sm text-gray-600">Facilities Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">{Math.round(userStats.totalProcessingTime / 1000)}s</div>
              <div className="text-sm text-gray-600">Total Processing</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Eco Warrior</span>
              <span>{userStats.itemsScanned}/10</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${Math.min((userStats.itemsScanned / 10) * 100, 100)}%`}}
              ></div>
            </div>
            {userStats.itemsScanned >= 10 && (
              <div className="text-center mt-2">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  🏆 Eco Warrior Achieved!
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Eco Scanner Dialog */}
      <Dialog open={showRealtimeEcoScanner} onOpenChange={setShowRealtimeEcoScanner}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-green-600" />
              Real-Time Eco Scanner
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <RealtimeEcoScanner 
              onResult={(result) => {
                // Convert real-time result to waste item format
                const wasteItem: WasteItem = {
                  id: result.itemName.toLowerCase().replace(/\s+/g, '_'),
                  name: result.itemName,
                  type: result.quickAnalysis,
                  category: result.category === 'waste' ? 'general' : 
                          result.category === 'recycle' ? 'recyclable' :
                          result.category === 'hazardous' ? 'hazardous' :
                          result.category === 'unknown' ? 'general' :
                          result.category,
                  condition: result.condition === 'unclear' ? 'poor' : result.condition,
                  confidence: result.confidence,
                  disposalMethod: `Follow ${result.category} guidelines based on analysis`,
                  environmentalImpact: `Sustainability score: ${result.sustainabilityScore}/100. Carbon impact: ${result.carbonImpact}`,
                  nearbyLocations: [],
                  tips: result.quickTips,
                  recommendations: [`Action required: ${result.actionRequired || 'research'}`]
                }
                setSelectedWaste(wasteItem)
                // Update user stats
                setUserStats(prev => ({
                  itemsScanned: prev.itemsScanned + 1,
                  accurateAnalyses: result.confidence > 0.8 ? prev.accurateAnalyses + 1 : prev.accurateAnalyses,
                  facilitiesFound: prev.facilitiesFound + 1,
                  totalProcessingTime: prev.totalProcessingTime + 1500
                }))
              }}
              className="min-h-[500px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
