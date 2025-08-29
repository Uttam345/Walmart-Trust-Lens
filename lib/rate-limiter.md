UttamBansal-67: explain the whole code line by line with flow control for best understanding

GitHub Copilot: I'll explain this rate limiting code line by line with flow control for comprehensive understanding.

## File Structure and Purpose

```typescript
/**
 * Rate Limiting Utilities for Walmart Redesign Project
 * Helps manage API calls to prevent 429 errors and improve user experience
 */
```
This is a utility module designed to prevent API rate limiting errors (HTTP 429) in a Walmart redesign project.

## Type Definitions

```typescript
export interface RateLimitConfig {
  maxRequests: number      // Maximum allowed requests
  windowMs: number        // Time window in milliseconds
  retryAfterMs: number   // How long to block after limit exceeded
}

export interface RateLimitStatus {
  allowed: boolean           // Whether request is allowed
  remainingRequests?: number // How many requests left in window
  resetTime?: number        // When the window resets
  retryAfter?: number       // Milliseconds until unblocked
}
```
These interfaces define the configuration and response structure for rate limiting.

## RateLimiter Class

### Class Properties
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map()  // Stores request timestamps per client
  private blocked: Map<string, number> = new Map()     // Stores blocked clients with unblock time
  
  constructor(private config: RateLimitConfig) {}      // Stores configuration
```

**Flow Control**: The class uses two Maps to track state:
- `requests`: Maps client IDs to arrays of request timestamps
- `blocked`: Maps client IDs to unblock timestamps

### checkLimit Method - Core Logic

```typescript
checkLimit(identifier: string): RateLimitStatus {
  const now = Date.now()  // Current timestamp
```

**Step 1: Check if client is currently blocked**
```typescript
  const blockedUntil = this.blocked.get(identifier)
  if (blockedUntil && now < blockedUntil) {
    return {
      allowed: false,
      retryAfter: blockedUntil - now  // Time remaining until unblocked
    }
  }
```
**Flow**: If client exists in blocked map AND current time is before unblock time → deny request

**Step 2: Clean up expired blocks**
```typescript
  if (blockedUntil && now >= blockedUntil) {
    this.blocked.delete(identifier)  // Remove expired block
  }
```
**Flow**: If block time has passed → remove from blocked map

**Step 3: Process request history**
```typescript
  const requestTimes = this.requests.get(identifier) || []  // Get existing requests or empty array
  
  const validRequests = requestTimes.filter(
    time => now - time < this.config.windowMs  // Keep only requests within time window
  )
```
**Flow**: Filter out old requests that fall outside the configured time window

**Step 4: Check rate limit**
```typescript
  if (validRequests.length >= this.config.maxRequests) {
    this.blocked.set(identifier, now + this.config.retryAfterMs)  // Block client
    return {
      allowed: false,
      retryAfter: this.config.retryAfterMs
    }
  }
```
**Flow**: If valid requests ≥ max allowed → block client and deny request

**Step 5: Allow request and update state**
```typescript
  validRequests.push(now)  // Add current request timestamp
  this.requests.set(identifier, validRequests)  // Update request history

  return {
    allowed: true,
    remainingRequests: this.config.maxRequests - validRequests.length,
    resetTime: now + this.config.windowMs
  }
}
```
**Flow**: Add current request to history and return success with remaining quota

### Utility Methods

```typescript
reset(identifier: string): void {
  this.requests.delete(identifier)  // Clear request history
  this.blocked.delete(identifier)   // Clear block status
}

getStatus(identifier: string): { isBlocked: boolean; retryAfter?: number } {
  const now = Date.now()
  const blockedUntil = this.blocked.get(identifier)
  
  if (blockedUntil && now < blockedUntil) {
    return { isBlocked: true, retryAfter: blockedUntil - now }
  }
  return { isBlocked: false }
}
```

## Pre-configured Rate Limiters

```typescript
export const apiRateLimiters = {
  realtime: new RateLimiter({
    maxRequests: 15,    // 15 requests
    windowMs: 60000,    // per 1 minute
    retryAfterMs: 30000 // block for 30 seconds
  }),
  
  fullScan: new RateLimiter({
    maxRequests: 10,    // 10 requests  
    windowMs: 60000,    // per 1 minute
    retryAfterMs: 60000 // block for 1 minute
  }),
  
  gemini: new RateLimiter({
    maxRequests: 20,    // 20 requests
    windowMs: 60000,    // per 1 minute  
    retryAfterMs: 45000 // block for 45 seconds
  })
}
```
Different rate limiters for different API endpoints with varying strictness.

## ExponentialBackoff Class

### Properties and Constructor
```typescript
export class ExponentialBackoff {
  private attempts = 0              // Current attempt count
  private readonly maxAttempts: number     // Maximum retry attempts
  private readonly baseDelayMs: number     // Base delay for backoff
  private readonly maxDelayMs: number      // Maximum delay cap

  constructor(maxAttempts = 5, baseDelayMs = 1000, maxDelayMs = 30000) {
    // Set configuration with defaults
  }
```

### Execute Method - Retry Logic

```typescript
async execute<T>(operation: () => Promise<T>): Promise<T> {
  while (this.attempts < this.maxAttempts) {  // Loop until max attempts
    try {
      const result = await operation()  // Try the operation
      this.reset()                     // Reset on success
      return result
    } catch (error) {
      this.attempts++                  // Increment attempt counter
      
      if (this.attempts >= this.maxAttempts) {
        throw new Error(`Operation failed after ${this.maxAttempts} attempts: ${error}`)
      }
```

**Flow Control**: 
1. Try operation
2. If success → reset attempts and return
3. If error → increment attempts
4. If max attempts reached → throw final error

**Rate Limit Detection**
```typescript
      const isRateLimit = error instanceof Error && (
        error.message.includes('429') ||
        error.message.includes('rate limit') ||
        error.message.includes('quota')
      )

      if (!isRateLimit) {
        throw error  // Don't retry non-rate-limit errors
      }
```
**Flow**: Only retry if error indicates rate limiting

**Exponential Backoff Calculation**
```typescript
      const delay = Math.min(
        this.baseDelayMs * Math.pow(2, this.attempts - 1),  // 2^attempts * base
        this.maxDelayMs                                      // Capped at max
      )

      console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${this.attempts}/${this.maxAttempts})`)
      await this.delay(delay)  // Wait before retry
```
**Flow**: Calculate exponential delay (1s, 2s, 4s, 8s...) capped at maximum

## Utility Functions

### Rate Limit Error Detection
```typescript
export function isRateLimitError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || error.toString() || ''
  const status = error.status || error.statusCode || 0
  
  return (
    status === 429 ||                          // HTTP status
    message.includes('429') ||                 // Status in message
    message.includes('Too Many Requests') ||   // Common phrases
    message.includes('rate limit') ||
    message.includes('quota exceeded') ||
    message.includes('rate_limit_exceeded')
  )
}
```

### Retry Delay Extraction
```typescript
export function getRetryDelay(error: any): number {
  // Try to extract from error response
  const retryAfter = error.retryAfter || error.retry_after
  if (retryAfter) {
    return typeof retryAfter === 'number' ? retryAfter * 1000 : parseInt(retryAfter) * 1000
  }

  // Look in error message for delay hints
  const message = error.message || ''
  const delayMatch = message.match(/(\d+)\s*(?:seconds?|s)/i)
  if (delryMatch) {
    return parseInt(delayMatch[1]) * 1000
  }

  return 30000 // Default fallback
}
```
**Flow**: 
1. Check error object for retry headers
2. Parse message for delay hints
3. Fall back to 30 seconds

### Client Identification
```typescript
export function createClientId(request?: any): string {
  if (typeof window !== 'undefined') {
    return 'browser-client'  // Browser environment
  }
  
  if (request && request.headers) {
    // Extract IP from headers for server environment
    const forwarded = request.headers.get?.('x-forwarded-for') || 
                     request.headers['x-forwarded-for']
    const realIp = request.headers.get?.('x-real-ip') || 
                   request.headers['x-real-ip']
    
    return forwarded || realIp || 'default-client'
  }
  
  return 'server-client'  // Server without request context
}
```
**Flow**: Determine client identifier based on environment (browser vs server) and available request data.

## Overall Flow Control Summary

1. **Rate Limiting**: Track requests per client in time windows, block when exceeded
2. **Exponential Backoff**: Retry failed operations with increasing delays
3. **Error Detection**: Identify rate limit errors vs other errors
4. **Client Identification**: Create unique identifiers for rate limit tracking

This system provides comprehensive protection against API rate limits with intelligent retry mechanisms.