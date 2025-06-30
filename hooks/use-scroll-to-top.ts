"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface UseScrollToTopOptions {
  behavior?: "auto" | "smooth"
  delay?: number
  enabled?: boolean
}

export function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const pathname = usePathname()
  const { behavior = "auto", delay = 0, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior,
      })
    }

    if (delay > 0) {
      const timer = setTimeout(scrollToTop, delay)
      return () => clearTimeout(timer)
    } else {
      scrollToTop()
    }
  }, [pathname, behavior, delay, enabled])
}
