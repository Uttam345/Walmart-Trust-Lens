import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { EnhancedScrollBehavior } from "@/components/enhanced-scroll-behavior"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Walmart SmartScan Pro - Social Proof Scanner",
  description:
    "Make smarter purchases with community wisdom. Scan products and see what your friends, neighbors, and similar shoppers think.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <EnhancedScrollBehavior />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
