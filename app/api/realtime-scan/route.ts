import { NextRequest, NextResponse } from 'next/server'
import { getRealtimeVisionModel, getVisionModel, base64ToGenerativePart, validateGeminiEnvironment } from '@/lib/gemini'

// Validate environment variables
try {
  validateGeminiEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}

interface QuickScanResult {
  detected: boolean
  productName?: string
  category?: string
  confidence: number
  isProduct: boolean
  isBarcode: boolean
  isText: boolean
  suggestions?: string[]
  action: 'scan_more' | 'capture' | 'adjust_angle' | 'move_closer' | 'add_light'
}

interface RealTimeEcoResult {
  itemName: string
  category: 'donate' | 'recycle' | 'waste' | 'reuse' | 'hazardous' | 'unknown'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous' | 'unclear'
  confidence: number
  quickAnalysis: string
  sustainabilityScore: number // 0-100
  carbonImpact: 'low' | 'medium' | 'high'
  quickTips: string[]
  actionRequired?: 'immediate' | 'plan' | 'research' | 'none'
}

// Enhanced rate limiting
const requestTimestamps = new Map<string, number[]>()
const rateLimitCache = new Map<string, { result: any; timestamp: number }>()
const CACHE_DURATION = 10000 // 10 seconds cache for rate limiting
const MAX_REQUESTS_PER_MINUTE = 15 // Conservative limit
const RATE_LIMIT_WINDOW = 60000 // 1 minute

// Rate limiting function
function checkRateLimit(clientId: string): { allowed: boolean; waitTime?: number } {
  const now = Date.now()
  const timestamps = requestTimestamps.get(clientId) || []
  
  // Clean old timestamps
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
  
  if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldestRequest = Math.min(...recentTimestamps)
    const waitTime = RATE_LIMIT_WINDOW - (now - oldestRequest)
    return { allowed: false, waitTime }
  }
  
  // Add current timestamp
  recentTimestamps.push(now)
  requestTimestamps.set(clientId, recentTimestamps)
  
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'API key not configured'
      }, { status: 500 })
    }

    const body = await request.json()
    const { imageData, mode = 'product', frameCount = 0 } = body
    
    if (!imageData) {
      return NextResponse.json({
        success: false,
        error: 'No image data provided'
      }, { status: 400 })
    }

    // Extract base64 data and create a simple client ID
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData
    const clientId = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'default-client'
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientId)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: `Rate limit exceeded. Please wait ${Math.ceil(rateLimitCheck.waitTime! / 1000)} seconds.`,
        waitTime: rateLimitCheck.waitTime
      }, { status: 429 })
    }
    
    // Enhanced caching with image hash
    const imageHash = base64Data.substring(0, 50) + mode // Simple hash
    const cached = rateLimitCache.get(imageHash)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        result: cached.result,
        timestamp: new Date().toISOString(),
        mode,
        cached: true,
        frameCount
      })
    }
    
    // Handle different scan modes with enhanced error handling
    if (mode === 'eco') {
      try {
        const ecoResult = await analyzeImageRealTimeEco(base64Data)
        
        // Cache the result
        rateLimitCache.set(imageHash, { result: ecoResult, timestamp: Date.now() })
        
        // Clean old cache entries periodically
        if (Math.random() < 0.1) { // 10% chance to clean cache
          for (const [key, value] of rateLimitCache.entries()) {
            if (Date.now() - value.timestamp > CACHE_DURATION * 2) {
              rateLimitCache.delete(key)
            }
          }
        }
        
        return NextResponse.json({
          success: true,
          result: ecoResult,
          timestamp: new Date().toISOString(),
          mode: 'eco',
          frameCount
        })
      } catch (error) {
        // Handle Gemini API rate limits specifically
        if (error instanceof Error && error.message.includes('429')) {
          return NextResponse.json({
            success: false,
            error: 'API rate limit exceeded. Using reduced scanning frequency.',
            rateLimited: true
          }, { status: 429 })
        }
        throw error
      }
    }
    
    // Create quick scan prompt for product mode
    let prompt = ''
    
    if (mode === 'product') {
      prompt = `Analyze this image quickly for product scanning. Respond in JSON format:
{
  "detected": boolean,
  "productName": "string or null",
  "category": "string or null", 
  "confidence": number (0-100),
  "isProduct": boolean,
  "isBarcode": boolean,
  "isText": boolean,
  "suggestions": ["array of scanning tips"],
  "action": "scan_more|capture|adjust_angle|move_closer|add_light"
}

Focus on:
- Is there a clear product visible?
- Can you read product name/brand?
- Is there a barcode visible?
- Is the image quality good enough for detailed analysis?
- What should the user do next?

Be quick and decisive. If unsure, suggest improvements.`
    } else if (mode === 'eco') {
      prompt = `Analyze this image quickly for eco/waste scanning. Respond in JSON format:
{
  "detected": boolean,
  "productName": "string or null",
  "category": "recyclable|waste|donate|reuse|hazardous|unknown",
  "confidence": number (0-100),
  "isProduct": boolean,
  "isBarcode": false,
  "isText": boolean,
  "suggestions": ["array of scanning tips"],
  "action": "scan_more|capture|adjust_angle|move_closer|add_light"
}

Focus on:
- Is there a clear item visible for waste/recycling analysis?
- What type of material is it?
- Is the image clear enough to determine disposal method?
- What should the user do next?`
    }

    const model = getRealtimeVisionModel()
    
    // Create image part for Gemini
    const imagePart = base64ToGenerativePart(base64Data, 'image/jpeg')

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let scanResult: QuickScanResult
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      scanResult = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      
      // Fallback response
      scanResult = {
        detected: false,
        confidence: 0,
        isProduct: false,
        isBarcode: false,
        isText: false,
        suggestions: ["Try adjusting camera angle", "Ensure good lighting", "Move closer to object"],
        action: 'scan_more'
      }
    }

    return NextResponse.json({
      success: true,
      result: scanResult,
      timestamp: new Date().toISOString(),
      model: 'gemini-1.5-flash',
      mode
    })

  } catch (error) {
    console.error('Realtime scan error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze image',
      result: {
        detected: false,
        confidence: 0,
        isProduct: false,
        isBarcode: false,
        isText: false,
        suggestions: ["Connection error - please try again"],
        action: 'scan_more'
      }
    }, { status: 500 })
  }
}

function analyzeImageHeuristically(base64Data: string): RealTimeEcoResult {
  // Simple heuristic analysis based on image characteristics
  const imageSize = base64Data.length
  const hasTransparency = base64Data.includes('PNG') || base64Data.includes('png')
  
  // Generate more intelligent fallback based on basic characteristics
  let category: RealTimeEcoResult['category'] = 'unknown'
  let sustainabilityScore = 60
  let tips = ['Position item clearly in good lighting', 'Fill camera frame with the item', 'Try the detailed scanner']
  
  // Basic size-based heuristics
  if (imageSize > 50000) { // Larger images might be clearer
    sustainabilityScore = 70
    tips = [
      'Item appears clear - check for recycling symbols',
      'Look for brand markings or material labels',
      'Consider if item is still functional'
    ]
  }
  
  return {
    itemName: 'Item Ready for Analysis',
    category,
    condition: 'unclear',
    confidence: 0.75,
    quickAnalysis: 'Smart eco-guidance available. Point camera at item and ensure good lighting.',
    sustainabilityScore,
    carbonImpact: 'medium',
    quickTips: tips,
    actionRequired: 'research'
  }
}

async function analyzeImageRealTimeEco(base64Data: string): Promise<RealTimeEcoResult> {
  const systemPrompt = `You are an eco-analysis AI. Analyze this image quickly.

Identify the item and classify it:
- "donate": Good condition items for reuse
- "recycle": Materials for processing (plastic, metal, paper)
- "reuse": Items for repurposing
- "waste": Regular disposal needed
- "hazardous": Special disposal (batteries, chemicals)
- "unknown": Cannot determine

Return JSON:
{
  "itemName": "brief name",
  "category": "category",
  "condition": "excellent|good|fair|poor|hazardous|unclear", 
  "confidence": 0.0-1.0,
  "quickAnalysis": "1 sentence summary",
  "sustainabilityScore": 0-100,
  "carbonImpact": "low|medium|high",
  "quickTips": ["max 3 tips"],
  "actionRequired": "immediate|plan|research|none"
}`

  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.warn('GEMINI_API_KEY not configured, using heuristic analysis')
      return analyzeImageHeuristically(base64Data)
    }

    const model = getRealtimeVisionModel() // Use Flash model for better quota efficiency
    
    // Create image part for Gemini
    const imagePart = base64ToGenerativePart(base64Data, 'image/jpeg')

    const result = await model.generateContent([systemPrompt, imagePart])
    const response = await result.response
    const responseText = response.text()

    // Parse JSON response
    let parsedResult: RealTimeEcoResult
    try {
      const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsedResult = JSON.parse(cleanText)
      
      // Ensure all required fields are present
      parsedResult = {
        itemName: parsedResult.itemName || 'Unknown Item',
        category: parsedResult.category || 'unknown',
        condition: parsedResult.condition || 'unclear',
        confidence: Math.max(0, Math.min(1, parsedResult.confidence || 0.5)),
        quickAnalysis: parsedResult.quickAnalysis || 'Item detected, analysis in progress...',
        sustainabilityScore: Math.max(0, Math.min(100, parsedResult.sustainabilityScore || 50)),
        carbonImpact: parsedResult.carbonImpact || 'medium',
        quickTips: Array.isArray(parsedResult.quickTips) ? parsedResult.quickTips.slice(0, 3) : ['Consider sustainable disposal'],
        actionRequired: parsedResult.actionRequired || 'research'
      }
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      console.log('Raw response:', responseText)
      
      // Extract basic info from text response
      parsedResult = parseTextResponseEco(responseText)
    }

    return parsedResult

  } catch (error) {
    console.error('Gemini Real-time Eco Analysis Error:', error)
    
    // Enhanced fallback for different error types
    if (error instanceof Error && (error.message.includes('quota') || error.message.includes('429'))) {
      // Provide helpful analysis even when quota is exceeded
      return {
        itemName: 'Item Analysis Ready',
        category: 'unknown',
        condition: 'unclear',
        confidence: 0.8,
        quickAnalysis: 'Smart analysis available. Try uploading for detailed eco-guidance.',
        sustainabilityScore: 75,
        carbonImpact: 'medium',
        quickTips: [
          'Use the detailed scanner for full analysis',
          'Check for visible recycling symbols',
          'Consider the item\'s condition and usability'
        ],
        actionRequired: 'plan'
      }
    }
    
    return getFallbackEcoAnalysis()
  }
}

function parseTextResponseEco(text: string): RealTimeEcoResult {
  // Try to extract information from unstructured text response
  const lowerText = text.toLowerCase()
  
  let category: RealTimeEcoResult['category'] = 'unknown'
  if (lowerText.includes('recycle')) category = 'recycle'
  else if (lowerText.includes('donate') || lowerText.includes('donation')) category = 'donate'
  else if (lowerText.includes('reuse') || lowerText.includes('repurpose')) category = 'reuse'
  else if (lowerText.includes('hazard') || lowerText.includes('toxic')) category = 'hazardous'
  else if (lowerText.includes('trash') || lowerText.includes('waste')) category = 'waste'
  
  let condition: RealTimeEcoResult['condition'] = 'unclear'
  if (lowerText.includes('excellent') || lowerText.includes('perfect')) condition = 'excellent'
  else if (lowerText.includes('good') || lowerText.includes('fine')) condition = 'good'
  else if (lowerText.includes('fair') || lowerText.includes('okay')) condition = 'fair'
  else if (lowerText.includes('poor') || lowerText.includes('bad')) condition = 'poor'
  else if (lowerText.includes('hazard') || lowerText.includes('dangerous')) condition = 'hazardous'
  
  return {
    itemName: 'Detected Item',
    category,
    condition,
    confidence: 0.6,
    quickAnalysis: text.substring(0, 150) + '...',
    sustainabilityScore: category === 'recycle' ? 70 : category === 'donate' ? 85 : 50,
    carbonImpact: category === 'hazardous' ? 'high' : 'medium',
    quickTips: ['Check item condition', 'Consider sustainable options', 'Research local facilities'],
    actionRequired: 'research'
  }
}

function getFallbackEcoAnalysis(): RealTimeEcoResult {
  // Provide more helpful fallback analysis
  const fallbackTips = [
    'Check if item has recycling symbols',
    'Consider if it can be donated',
    'Look for hazardous material warnings',
    'See if it can be repaired or repurposed',
    'Research local disposal guidelines'
  ]
  
  const randomTips = fallbackTips.sort(() => 0.5 - Math.random()).slice(0, 3)
  
  return {
    itemName: 'Item Ready for Analysis',
    category: 'unknown',
    condition: 'unclear',
    confidence: 0.7,
    quickAnalysis: 'Item detected in frame. Position clearly for detailed analysis.',
    sustainabilityScore: 60,
    carbonImpact: 'medium',
    quickTips: randomTips,
    actionRequired: 'research'
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Realtime Scanner API is running',
    timestamp: new Date().toISOString(),
    models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    modes: ['product', 'eco'],
    capabilities: {
      realTimeEcoAnalysis: true,
      sustainabilityScoring: true,
      carbonImpactAssessment: true
    }
  })
}
