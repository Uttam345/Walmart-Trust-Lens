import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Star, Award } from "lucide-react"

export function SustainableProducts() {
  const products = [
    {
      id: "detergent789",
      name: "Seventh Generation Laundry Detergent",
      price: "$12.99",
      rating: 4.6,
      ecoScore: 95,
      certifications: ["Organic", "Biodegradable"],
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "plates456",
      name: "Bamboo Fiber Plates Set",
      price: "$24.99",
      rating: 4.8,
      ecoScore: 92,
      certifications: ["Renewable", "Compostable"],
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "bulbs123",
      name: "LED Energy Star Bulbs",
      price: "$8.99",
      rating: 4.7,
      ecoScore: 88,
      certifications: ["Energy Star", "Long-lasting"],
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span>Recommended Eco-Friendly Products</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-lg font-bold text-green-600 mb-2">{product.price}</p>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Eco Score: {product.ecoScore}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.certifications.map((cert, certIndex) => (
                    <span key={certIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
                <Link href={`/scanner?product=${product.id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    View Product
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
