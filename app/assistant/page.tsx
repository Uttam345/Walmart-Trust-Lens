import { Header } from "@/components/header"
import { AIChat } from "@/components/ai-chat"
import { QuickActions } from "@/components/quick-actions"

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Shopping Assistant</h1>
          <p className="text-gray-600">Get personalized recommendations and shopping advice</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AIChat />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
