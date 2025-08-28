"use client"

import { useEffect, useState } from "react"

/**
 * A hook that ensures hydration safety by only running client-side code after mount
 * This prevents hydration mismatches when using browser APIs or dynamic values
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * A hook that returns a stable random value that won't cause hydration issues
 */
export function useStableRandom(seed?: string) {
  const [randomValue, setRandomValue] = useState(0.5) // Default fallback
  const isHydrated = useHydrationSafe()

  useEffect(() => {
    if (isHydrated) {
      // Simple seeded random if seed is provided, otherwise Math.random
      if (seed) {
        let hash = 0
        for (let i = 0; i < seed.length; i++) {
          const char = seed.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32bit integer
        }
        setRandomValue(Math.abs(hash) / 2147483647)
      } else {
        setRandomValue(Math.random())
      }
    }
  }, [isHydrated, seed])

  return randomValue
}
