import { Star, Eye, Shield } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Star,
      title: "50M+ Reviews",
      description: "Access millions of authentic customer reviews",
    },
    {
      icon: Eye,
      title: "Real-time Insights",
      description: "Get instant product insights and recommendations",
    },
    {
      icon: Shield,
      title: "Verified Ratings",
      description: "Trust verified ratings from real shoppers",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
