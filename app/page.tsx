import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { SocialProofShowcase } from "@/components/social-proof-showcase"
import { CommunityImpact } from "@/components/community-impact"
import { WalmartIntegration } from "@/components/walmart-integration"
import { CTA } from "@/components/cta"
import { OnboardingTrigger } from "@/components/onboarding-trigger"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <SocialProofShowcase />
      <CommunityImpact />
      <WalmartIntegration />
      <CTA />
      <OnboardingTrigger />
    </div>
  )
}
