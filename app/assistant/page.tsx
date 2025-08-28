"use client"
//"use client" is a Next.js App Router directive that marks a file as a client component (runs in the browser). Add it at the very top of the file when you need hooks, state, event handlers, or browser APIs.

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AIChat } from "@/components/ai-chat"
import { Toaster } from "@/components/ui/toaster"

export default function AssistantPage() {
  const [chatContext, setChatContext] = useState({
    scannedProducts: [],
    userPreferences: {},
    currentLocation: 'Unknown',
  })

  useEffect(() => {
    // Load user context from localStorage once the component first mounts
    try {
      const userData = localStorage.getItem("walmart-user-data")
      const scannedHistory = localStorage.getItem("walmart-scan-history")
      
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        setChatContext(prev => ({
          ...prev,
          userPreferences: parsedUserData,
        }))
      }
      
      if (scannedHistory) {
        const parsedHistory = JSON.parse(scannedHistory)
        setChatContext(prev => ({
          ...prev,
          scannedProducts: parsedHistory.slice(-5), // Last 5 scanned products
        }))
      }
    } catch (error) {
      console.error('Error loading user context:', error)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AIChat context={chatContext} />
      </div>
      <Toaster />
    </div>
  )
}