import { Scan, Users, Leaf, Bot } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Scan,
      title: "Smart Product Scanner",
      description: "Scan QR codes and barcodes to instantly access detailed product information and community insights",
    },
    {
      icon: Users,
      title: "Social Proof Network",
      description: "See authentic reviews and purchase patterns from your trusted network and local community",
    },
    {
      icon: Leaf,
      title: "Sustainability Tracking",
      description: "Earn green points, track your carbon footprint, and make eco-friendly choices with rewards",
    },
    {
      icon: Bot,
      title: "AI Shopping Assistant",
      description: "Get personalized recommendations and smart suggestions powered by advanced AI technology",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Smarter Shopping
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Combine social trust, sustainability insights, and AI intelligence for confident purchase decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
