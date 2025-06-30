"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface SmoothScrollLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function SmoothScrollLink({ href, children, className, onClick }: SmoothScrollLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Call any additional onClick handler
    if (onClick) {
      onClick()
    }

    // Navigate to the new route
    router.push(href)

    // Smooth scroll to top after a brief delay to ensure navigation completes
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 100)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
