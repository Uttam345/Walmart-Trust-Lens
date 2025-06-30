"use client"

import { useState, useEffect } from "react"
import { OnboardingFlow } from "./onboarding/onboarding-flow"
import { QuickStartBanner } from "./onboarding/quick-start-banner"

export function OnboardingTrigger() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showQuickStartBanner, setShowQuickStartBanner] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("walmart-onboarding-completed")
    const userData = localStorage.getItem("walmart-user-data")

    if (!hasCompletedOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        // Check if user skipped setup (minimal data)
        const isMinimalSetup =
          !parsedData.contactsPermission &&
          !parsedData.locationPermission &&
          !parsedData.name &&
          parsedData.categories?.length <= 1

        if (isMinimalSetup) {
          setShowQuickStartBanner(true)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleOnboardingComplete = (data: any) => {
    try {
      // Ensure data is clean and serializable
      const cleanData = {
        contactsPermission: Boolean(data.contactsPermission),
        locationPermission: Boolean(data.locationPermission),
        shoppingFrequency: String(data.shoppingFrequency || ""),
        avgSpending: String(data.avgSpending || ""),
        categories: Array.isArray(data.categories) ? data.categories : [],
        sustainabilityImportance: Number(data.sustainabilityImportance) || 5,
        name: String(data.name || ""),
        age: String(data.age || ""),
        householdSize: String(data.householdSize || ""),
        completedTutorial: Boolean(data.completedTutorial),
        completedAt: new Date().toISOString(),
      }

      // Save onboarding data
      localStorage.setItem("walmart-onboarding-completed", "true")
      localStorage.setItem("walmart-user-data", JSON.stringify(cleanData))

      // Log clean data for debugging
      console.log("Onboarding completed with clean data:", cleanData)

      setShowOnboarding(false)
    } catch (error) {
      console.error("Error saving onboarding data:", error)
      // Still mark as completed to avoid infinite loop
      localStorage.setItem("walmart-onboarding-completed", "true")
      setShowOnboarding(false)
    }
  }

  const handleClose = () => {
    // Mark as completed even if closed early
    localStorage.setItem("walmart-onboarding-completed", "true")
    setShowOnboarding(false)
  }

  const handleStartSetupFromBanner = () => {
    setShowQuickStartBanner(false)
    setShowOnboarding(true)
  }

  return (
    <>
      {showQuickStartBanner && (
        <div className="fixed bottom-4 right-4 z-40 max-w-md">
          <QuickStartBanner onStartSetup={handleStartSetupFromBanner} />
        </div>
      )}
      <OnboardingFlow isOpen={showOnboarding} onClose={handleClose} onComplete={handleOnboardingComplete} />
    </>
  )
}
