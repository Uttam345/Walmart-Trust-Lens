import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { EnhancedScrollBehavior } from "@/components/enhanced-scroll-behavior"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Walmart TrustLens - Transparent Shopping Intelligence",
  description:
    "Make informed purchases with transparency and trust."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <EnhancedScrollBehavior />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
