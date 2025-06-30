import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Smartphone, Users, Leaf, Star, Zap } from "lucide-react"

export function WalmartIntegration() {
  const features = [
    {
      icon: Smartphone,
      title: "Seamless Walmart Integration",
      description: "Scan products directly in-store or online with instant social proof data",
      benefits: ["Real-time inventory", "Price matching", "Store locator"],
      link: "/scanner",
    },
    {
      icon: Users,
      title: "Community-Powered Recommendations",
      description: "Leverage millions of Walmart shopper experiences for better decisions",
      benefits: ["Peer reviews", "Usage patterns", "Trending products"],
      link: "/social",
    },
    {
      icon: Leaf,
      title: "Sustainability at Scale",
      description: "Make eco-conscious choices with community-validated green products",
      benefits: ["Carbon footprint", "Eco certifications", "Sustainable alternatives"],
      link: "/sustainability",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShoppingCart className="w-4 h-4" />
            <span>Enhanced Walmart Experience</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Transforming How You Shop at Walmart</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our social proof technology integrates seamlessly with your Walmart shopping experience, providing instant
            community insights that drive smarter purchases and sustainable choices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Walmart Shopping Flow */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Your Enhanced Walmart Shopping Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Scan Product",
                description: "Use your phone to scan any Walmart product",
                icon: Smartphone,
                link: "/scanner",
              },
              {
                step: "2",
                title: "See Social Proof",
                description: "Instantly view community ratings and reviews",
                icon: Users,
                link: "/social",
              },
              {
                step: "3",
                title: "Check Sustainability",
                description: "Get eco-impact data and green alternatives",
                icon: Leaf,
                link: "/sustainability",
              },
              {
                step: "4",
                title: "Make Smart Choice",
                description: "Purchase with confidence and community backing",
                icon: Zap,
                link: "/achievements",
              },
            ].map((step, index) => (
              <Link key={index} href={step.link}>
                <div className="text-center cursor-pointer hover:transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
