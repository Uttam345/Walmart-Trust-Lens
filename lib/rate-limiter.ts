/**
 * Rate Limiting Utilities for Walmart Redesign Project
 * Helps manage API calls to prevent 429 errors and improve user experience
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  retryAfterMs: number
}

export interface RateLimitStatus {
  allowed: boolean
  remainingRequests?: number
  resetTime?: number
  retryAfter?: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private blocked: Map<string, number> = new Map()
  
  constructor(private config: RateLimitConfig) {}

  checkLimit(identifier: string): RateLimitStatus {
    const now = Date.now()
    
    // Check if currently blocked
    const blockedUntil = this.blocked.get(identifier)
    if (blockedUntil && now < blockedUntil) {
      return {
        allowed: false,
        retryAfter: blockedUntil - now
      }
    }

    // Clean up expired block
    if (blockedUntil && now >= blockedUntil) {
      this.blocked.delete(identifier)
    }

    // Get request history
    const requestTimes = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requestTimes.filter(
      time => now - time < this.config.windowMs
    )

    // Check if limit exceeded
    if (validRequests.length >= this.config.maxRequests) {
      // Block for retry period
      this.blocked.set(identifier, now + this.config.retryAfterMs)
      return {
        allowed: false,
        retryAfter: this.config.retryAfterMs
      }
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)

    return {
      allowed: true,
      remainingRequests: this.config.maxRequests - validRequests.length,
      resetTime: now + this.config.windowMs
    }
  }

  reset(identifier: string): void {
    this.requests.delete(identifier)
    this.blocked.delete(identifier)
  }

  getStatus(identifier: string): { isBlocked: boolean; retryAfter?: number } {
    const now = Date.now()
    const blockedUntil = this.blocked.get(identifier)
    
    if (blockedUntil && now < blockedUntil) {
      return {
        isBlocked: true,
        retryAfter: blockedUntil - now
      }
    }

    return { isBlocked: false }
  }
}

// Pre-configured rate limiters for different API endpoints
export const apiRateLimiters = {
  realtime: new RateLimiter({
    maxRequests: 15,
    windowMs: 60000, // 1 minute
    retryAfterMs: 30000 // 30 seconds
  }),
  
  fullScan: new RateLimiter({
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    retryAfterMs: 60000 // 1 minute
  }),
  
  gemini: new RateLimiter({
    maxRequests: 20,
    windowMs: 60000, // 1 minute
    retryAfterMs: 45000 // 45 seconds
  })
}

/**
 * Exponential backoff utility
 */
export class ExponentialBackoff {
  private attempts = 0
  private readonly maxAttempts: number
  private readonly baseDelayMs: number
  private readonly maxDelayMs: number

  constructor(
    maxAttempts = 5,
    baseDelayMs = 1000,
    maxDelayMs = 30000
  ) {
    this.maxAttempts = maxAttempts
    this.baseDelayMs = baseDelayMs
    this.maxDelayMs = maxDelayMs
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    while (this.attempts < this.maxAttempts) {
      try {
        const result = await operation()
        this.reset() // Reset on success
        return result
      } catch (error) {
        this.attempts++
        
        if (this.attempts >= this.maxAttempts) {
          throw new Error(`Operation failed after ${this.maxAttempts} attempts: ${error}`)
        }

        // Check if it's a rate limit error
        const isRateLimit = error instanceof Error && (
          error.message.includes('429') ||
          error.message.includes('rate limit') ||
          error.message.includes('quota')
        )

        if (!isRateLimit) {
          throw error // Don't retry non-rate-limit errors
        }

        const delay = Math.min(
          this.baseDelayMs * Math.pow(2, this.attempts - 1),
          this.maxDelayMs
        )

        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${this.attempts}/${this.maxAttempts})`)
        await this.delay(delay)
      }
    }

    throw new Error(`Operation failed after ${this.maxAttempts} attempts`)
  }

  reset(): void {
    this.attempts = 0
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getAttempts(): number {
    return this.attempts
  }
}

/**
 * Detect rate limit errors from various sources
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString() || ''
  const status = error.status || error.statusCode || 0
  
  return (
    status === 429 ||
    message.includes('429') ||
    message.includes('Too Many Requests') ||
    message.includes('rate limit') ||
    message.includes('quota exceeded') ||
    message.includes('rate_limit_exceeded')
  )
}

/**
 * Extract retry delay from error response
 */
export function getRetryDelay(error: any): number {
  // Try to extract from error response
  const retryAfter = error.retryAfter || error.retry_after
  if (retryAfter) {
    return typeof retryAfter === 'number' ? retryAfter * 1000 : parseInt(retryAfter) * 1000
  }

  // Look in error message for delay hints
  const message = error.message || ''
  const delayMatch = message.match(/(\d+)\s*(?:seconds?|s)/i)
  if (delayMatch) {
    return parseInt(delayMatch[1]) * 1000
  }

  // Default fallback
  return 30000 // 30 seconds
}

/**
 * Create a client identifier for rate limiting
 */
export function createClientId(request?: any): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    return 'browser-client'
  }
  
  if (request && request.headers) {
    // Server environment with request headers
    const forwarded = request.headers.get?.('x-forwarded-for') || 
                     request.headers['x-forwarded-for']
    const realIp = request.headers.get?.('x-real-ip') || 
                   request.headers['x-real-ip']
    
    return forwarded || realIp || 'default-client'
  }
  
  return 'server-client'
}
