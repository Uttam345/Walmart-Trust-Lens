"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, X, Zap } from "lucide-react"

interface SkipConfirmationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  currentStep: number
  totalSteps: number
}

export function SkipConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  currentStep,
  totalSteps,
}: SkipConfirmationModalProps) {
  if (!isOpen) return null

  const remainingSteps = totalSteps - currentStep - 1

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Skip Setup?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              You're about to skip the remaining {remainingSteps} setup steps. You'll miss out on:
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Personalized product recommendations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Friend purchase insights</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Local shopping trends</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Sustainability matching</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Good News!</span>
              </div>
              <p className="text-xs text-blue-800">
                You can always complete setup later in your profile settings to unlock these features.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Setup
            </Button>
            <Button onClick={onConfirm} className="flex-1 bg-gray-600 hover:bg-gray-700">
              <X className="w-4 h-4 mr-2" />
              Skip Anyway
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
