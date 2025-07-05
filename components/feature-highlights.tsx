import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scan, Users, Leaf, Bot, Award, Shield, Camera, BarChart3 } from "lucide-react"

export function FeatureHighlights() {
  const highlights = [
    {
      icon: Scan,
      title: "Advanced Scanner",
      description: "Scan QR codes, barcodes, and analyze product images with AI",
      features: ["Real-time scanning", "Product recognition", "Social validation"],
      color: "bg-blue-50 text-blue-600",
      badge: "Core Feature"
    },
    {
      icon: Leaf,
      title: "Sustainability Hub",
      description: "Track environmental impact and make eco-friendly choices",
      features: ["Carbon tracking", "Green points", "Waste management"],
      color: "bg-green-50 text-green-600",
      badge: "Eco-Friendly"
    },
    {
      icon: Users,
      title: "Social Proof",
      description: "Get insights from your trusted network anonymously",
      features: ["Friend recommendations", "Community trends", "Privacy protection"],
      color: "bg-purple-50 text-purple-600",
      badge: "Social"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Smart shopping companion powered by advanced AI",
      features: ["Natural language", "Personalized tips", "Product insights"],
      color: "bg-orange-50 text-orange-600",
      badge: "AI-Powered"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Smart Shopping
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From AI-powered scanning to community insights and sustainability tracking - all in one seamless experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${highlight.color} flex items-center justify-center flex-shrink-0`}>
                    <highlight.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{highlight.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {highlight.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{highlight.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {highlight.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-900">Mobile Optimized</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-gray-900">Privacy First</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-medium text-gray-900">Real-time Analytics</span>
            </div>
          </div>
          <p className="text-gray-600">
            Built with cutting-edge technology for the future of retail
          </p>
        </div>
      </div>
    </section>
  )
}
