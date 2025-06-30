"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function ScrollBehaviorContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if there's a hash in the URL for anchor scrolling
    const hash = window.location.hash

    if (hash) {
      // Scroll to anchor element
      const element = document.querySelector(hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 100)
        return
      }
    }

    // Default scroll to top for route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [pathname, searchParams])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to ensure the route change is processed
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }, 50)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return null
}

function ScrollBehaviorFallback() {
  return null
}

export function EnhancedScrollBehavior() {
  return (
    <Suspense fallback={<ScrollBehaviorFallback />}>
      <ScrollBehaviorContent />
    </Suspense>
  )
}
