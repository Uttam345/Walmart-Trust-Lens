"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WelcomeStep } from "./welcome-step"
import { ContactsPermissionStep } from "./contacts-permission-step"
import { LocationPermissionStep } from "./location-permission-step"
import { ShoppingPreferencesStep } from "./shopping-preferences-step"
import { PersonalizationStep } from "./personalization-step"
import { TutorialStep } from "./tutorial-step"
import { CompletionStep } from "./completion-step"
import { X } from "lucide-react"
import { SkipConfirmationModal } from "./skip-confirmation-modal"

interface OnboardingData {
  contactsPermission: boolean
  locationPermission: boolean
  shoppingFrequency: string
  avgSpending: string
  categories: string[]
  sustainabilityImportance: number
  name: string
  age: string
  householdSize: string
  completedTutorial: boolean
}

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: OnboardingData) => void
}

export function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    contactsPermission: false,
    locationPermission: false,
    shoppingFrequency: "",
    avgSpending: "",
    categories: [],
    sustainabilityImportance: 5,
    name: "",
    age: "",
    householdSize: "",
    completedTutorial: false,
  })

  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false)

  const steps = [
    { component: WelcomeStep, title: "Welcome to TrustLens", canSkip: false },
    { component: ContactsPermissionStep, title: "Connect with Friends", canSkip: true },
    { component: LocationPermissionStep, title: "Local Insights", canSkip: true },
    { component: ShoppingPreferencesStep, title: "Shopping Habits", canSkip: false },
    { component: PersonalizationStep, title: "Personal Details", canSkip: true },
    { component: TutorialStep, title: "How It Works", canSkip: true },
    { component: CompletionStep, title: "You're All Set!", canSkip: false },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  // Helper function to safely extract data from any object
  const sanitizeData = (data: any): Partial<OnboardingData> => {
    if (!data || typeof data !== "object") {
      return {}
    }

    const sanitized: Partial<OnboardingData> = {}

    // Only extract known properties and ensure they're primitive values
    if (typeof data.contactsPermission === "boolean") {
      sanitized.contactsPermission = data.contactsPermission
    }

    if (typeof data.locationPermission === "boolean") {
      sanitized.locationPermission = data.locationPermission
    }

    if (typeof data.shoppingFrequency === "string") {
      sanitized.shoppingFrequency = data.shoppingFrequency
    }

    if (typeof data.avgSpending === "string") {
      sanitized.avgSpending = data.avgSpending
    }

    if (Array.isArray(data.categories)) {
      sanitized.categories = (data.categories as string[]).filter((item: unknown): item is string => typeof item === "string")
    }

    if (typeof data.sustainabilityImportance === "number") {
      sanitized.sustainabilityImportance = data.sustainabilityImportance
    }

    if (typeof data.name === "string") {
      sanitized.name = data.name
    }

    if (typeof data.age === "string") {
      sanitized.age = data.age
    }

    if (typeof data.householdSize === "string") {
      sanitized.householdSize = data.householdSize
    }

    if (typeof data.completedTutorial === "boolean") {
      sanitized.completedTutorial = data.completedTutorial
    }

    return sanitized
  }

  const handleNext = (stepData?: any) => {
    try {
      // Sanitize the incoming data to remove any circular references
      const cleanStepData = stepData ? sanitizeData(stepData) : {}

      // Update state with clean data
      setOnboardingData((prev) => ({ ...prev, ...cleanStepData }))

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Complete onboarding with fully sanitized data
        const finalData = { ...onboardingData, ...cleanStepData }
        onComplete(finalData)
        onClose()
      }
    } catch (error) {
      console.error("Error in handleNext:", error)
      // Continue anyway to avoid blocking the user
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete(onboardingData)
        onClose()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (steps[currentStep].canSkip) {
      handleNext()
    }
  }

  const handleSkipAll = () => {
    if (currentStep === 0) {
      // Skip directly from welcome step
      completeSkipProcess()
    } else {
      // Show confirmation for other steps
      setShowSkipConfirmation(true)
    }
  }

  const completeSkipProcess = () => {
    try {
      // Create minimal default data for skipped onboarding
      const defaultData: OnboardingData = {
        contactsPermission: false,
        locationPermission: false,
        shoppingFrequency: "monthly",
        avgSpending: "50-100",
        categories: ["Groceries"],
        sustainabilityImportance: 5,
        name: "",
        age: "",
        householdSize: "",
        completedTutorial: false,
      }

      // Mark as completed and close
      onComplete(defaultData)
      onClose()
    } catch (error) {
      console.error("Error skipping onboarding:", error)
      // Still close to avoid blocking the user
      onClose()
    }
  }

  const handleSkipConfirm = () => {
    setShowSkipConfirmation(false)
    completeSkipProcess()
  }

  const handleSkipCancel = () => {
    setShowSkipConfirmation(false)
  }

  const CurrentStepComponent = steps[currentStep].component

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Skip All Button */}
                <Button variant="ghost" size="sm" onClick={handleSkipAll} className="text-gray-500 hover:text-gray-700">
                  Skip Setup
                </Button>
                {currentStep > 0 && (
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <CurrentStepComponent
              data={onboardingData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              onSkipAll={currentStep === 0 ? handleSkipAll : () => {}}
              canSkip={steps[currentStep].canSkip}
              isFirst={currentStep === 0}
            />
          </div>
        </CardContent>
      </Card>
      <SkipConfirmationModal
        isOpen={showSkipConfirmation}
        onConfirm={handleSkipConfirm}
        onCancel={handleSkipCancel}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </div>
  )
}
