import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This utility function provides a clean, type-safe way to:

// 1. Combine multiple class sources
// 2. Handle conditional classes
// 3. Resolve Tailwind CSS conflicts
// 4. Maintain clean component APIs

// The flow is: Input validation → Class combination → Conflict resolution → Optimized output