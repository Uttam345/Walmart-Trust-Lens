import { NextRequest, NextResponse } from 'next/server'
import { getVisionModel, base64ToGenerativePart, validateGeminiEnvironment } from '@/lib/gemini'

// Validate environment variables
try {
  validateGeminiEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}

interface EcoScanResult {
  itemName: string
  category: 'donate' | 'recycle' | 'waste' | 'reuse' | 'hazardous'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous'
  confidence: number
  analysis: string
  recommendations: string[]
  environmentalImpact: string
  disposalMethod: string
  tips: string[]
}

interface LocationData {
  latitude: number
  longitude: number
}

interface DisposalLocation {
  name: string
  address: string
  distance: string
  hours: string
  phone?: string
  acceptedItems: string[]
  rating: number
  type: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const location = formData.get('location') as string
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'No image provided'
      }, { status: 400 })
    }

    // Validate image size and type
    const maxSizeInMB = 10
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    
    if (image.size > maxSizeInBytes) {
      return NextResponse.json({
        success: false,
        error: `Image size must be less than ${maxSizeInMB}MB`
      }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({
        success: false,
        error: 'Only JPEG, PNG, and WebP images are supported'
      }, { status: 400 })
    }

    // Convert image to base64 more efficiently
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    const mimeType = image.type

    console.log(`Processing image: ${image.name}, Size: ${(image.size / 1024 / 1024).toFixed(2)}MB, Type: ${mimeType}`)

    // Analyze image with Gemini Pro Vision
    const ecoScanResult = await analyzeImageForEcoScanning(base64Image, mimeType)
    
    // Get nearby locations based on user location and scan result
    let nearbyLocations: DisposalLocation[] = []
    if (location) {
      const locationData = JSON.parse(location) as LocationData
      nearbyLocations = await getNearbyDisposalLocations(locationData, ecoScanResult.category)
    }

    return NextResponse.json({
      success: true,
      result: ecoScanResult,
      nearbyLocations,
      timestamp: new Date().toISOString(),
      imageProcessed: {
        size: `${(image.size / 1024 / 1024).toFixed(2)}MB`,
        type: mimeType,
        optimized: true
      }
    })

  } catch (error) {
    console.error('Eco-scan API Error:', error)
    
    // Handle specific rate limit errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json({
          success: false,
          error: 'API rate limit exceeded. Please wait a moment before trying again.',
          errorType: 'RATE_LIMIT',
          retryAfter: 30 // seconds
        }, { status: 429 })
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json({
          success: false,
          error: 'API configuration error. Please contact support.',
          errorType: 'CONFIG_ERROR'
        }, { status: 503 })
      }
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image',
      errorType: 'GENERAL_ERROR'
    }, { status: 500 })
  }
}

async function analyzeImageForEcoScanning(base64Image: string, mimeType: string): Promise<EcoScanResult> {
  const systemPrompt = `You are TrustLens Eco-AI, analyzing items for environmental impact and sustainable disposal. 

Analyze this image carefully and determine:
1. What is the specific item? (be very specific about brand, model, material if visible)
2. What exact condition is it in? (look for wear, damage, functionality indicators)
3. What's the best disposal/reuse method based on condition and material?
4. Environmental impact considerations and carbon footprint reduction
5. Specific disposal recommendations with actionable steps

Categories (choose the most appropriate):
- "donate": Items in good condition that others can use (clothes, electronics, furniture, books, toys)
- "recycle": Items that can be processed into new materials (bottles, cans, paper, certain plastics, metals)
- "reuse": Items that can be repurposed, upcycled, or used differently than intended
- "waste": Items that must go to regular trash (heavily contaminated, broken beyond repair)
- "hazardous": Items requiring special disposal (batteries, chemicals, electronics with toxic materials, paint, medical waste)

Conditions (assess carefully):
- "excellent": Like new, perfect condition, highly desirable for donation/resale
- "good": Minor wear only, fully functional, good for donation
- "fair": Noticeable wear but still functional, may need cleaning/minor repair
- "poor": Heavily worn, damaged, likely only suitable for recycling or disposal
- "hazardous": Contains dangerous materials regardless of physical condition

Provide your response as a JSON object with these exact fields:
{
  "itemName": "specific name of the item with details",
  "category": "donate|recycle|waste|reuse|hazardous",
  "condition": "excellent|good|fair|poor|hazardous",
  "confidence": 0.0-1.0,
  "analysis": "detailed analysis of the item, its condition, material composition, and specific observations from the image",
  "recommendations": ["specific, actionable steps for disposal/reuse"],
  "environmentalImpact": "detailed environmental impact description with specific benefits of proper disposal",
  "disposalMethod": "step-by-step disposal instructions with specific locations or methods",
  "tips": ["helpful preparation tips, cleaning instructions, or safety considerations"]
}`

  try {
    const model = getVisionModel()
    const prompt = `${systemPrompt}

Please analyze this image for eco-scanning. Examine the item carefully for condition, material, brand markings, damage, and any other relevant details. Provide detailed disposal recommendations based on what you observe.`

    // Create image part for Gemini
    const imagePart = base64ToGenerativePart(base64Image, mimeType)

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const responseText = response.text()

    // Parse JSON response
    let parsedResult: EcoScanResult
    try {
      const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsedResult = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      console.log('Raw response:', responseText)
      
      // Enhanced fallback response with more detail
      parsedResult = {
        itemName: "Item Analysis",
        category: "recycle",
        condition: "good",
        confidence: 0.6,
        analysis: "Analysis temporarily unavailable. Please ensure good lighting and clear view of the item, then try again.",
        recommendations: [
          "Take a clearer photo with better lighting",
          "Check with local recycling center for guidance",
          "Consider donation if item is functional",
          "Look for manufacturer disposal programs"
        ],
        environmentalImpact: "Proper disposal helps reduce landfill waste and supports circular economy principles.",
        disposalMethod: "Contact local waste management services or check municipal guidelines for proper disposal methods.",
        tips: [
          "Clean the item before disposal",
          "Remove any personal information or data",
          "Check local guidelines for specific requirements",
          "Consider repair or donation if item is still functional"
        ]
      }
    }

    return parsedResult

  } catch (error) {
    console.error('Gemini Eco-Analysis Error:', error)
    
    // Enhanced error handling for rate limits
    if (error instanceof Error && (
      error.message.includes('429') || 
      error.message.includes('Too Many Requests') ||
      error.message.includes('quota') ||
      error.message.includes('rate limit')
    )) {
      // Return a more informative fallback for rate limits
      return {
        itemName: "Rate Limit Reached",
        category: "recycle" as const,
        condition: "fair" as const,
        confidence: 0.3,
        analysis: "API rate limit exceeded. This is a temporary restriction from our AI service. Please wait a moment and try again.",
        recommendations: [
          "Wait 30-60 seconds before trying again",
          "Use manual disposal guidelines below",
          "Check local recycling programs",
          "Consider item condition for donation vs disposal"
        ],
        environmentalImpact: "Proper disposal regardless of analysis method helps protect our environment.",
        disposalMethod: "Follow local waste management guidelines while waiting for full analysis capability to return.",
        tips: [
          "Most electronics can be recycled at specialized centers",
          "Textiles in good condition can often be donated",
          "Check manufacturer websites for disposal programs",
          "Clean items before disposal or donation"
        ]
      }
    }
    
    // Enhanced fallback response for other errors
    return {
      itemName: 'Unknown Item - Image Analysis Failed',
      category: 'waste' as const,
      condition: 'fair' as const,
      confidence: 0.3,
      analysis: 'Unable to analyze the image clearly. This could be due to poor lighting, blur, or image quality issues. For best results, ensure the item is well-lit, in focus, and fills most of the frame.',
      recommendations: [
        'Take a clearer, well-lit photo for better analysis',
        'Ensure the item fills most of the camera frame',
        'Contact local waste management for specific guidance',
        'Consider if item can be cleaned, repaired, or repurposed'
      ],
      environmentalImpact: 'Proper disposal and classification helps reduce environmental impact and supports circular economy principles.',
      disposalMethod: 'Check local waste management guidelines or contact your municipal waste authority for proper disposal instructions.',
      tips: [
        'Retake photo with better lighting and focus',
        'Clean the item before photographing for better visibility',
        'Include any visible labels or markings in the photo',
        'Take photo from multiple angles if needed'
      ]
    }
  }
}

async function getNearbyDisposalLocations(location: LocationData, category: string): Promise<DisposalLocation[]> {
  // TODO: Integrate with real location services
  // 
  // INTEGRATION GUIDE:
  // ==================
  // 
  // 1. Google Places API Integration:
  //    - Get API key from Google Cloud Console
  //    - Add GOOGLE_PLACES_API_KEY to environment variables
  //    - Use Place Search API to find disposal facilities
  //    - Example endpoint: https://maps.googleapis.com/maps/api/place/nearbysearch/json
  // 
  // 2. Other Services to Consider:
  //    - Foursquare Places API
  //    - Bing Maps API
  //    - Local municipality APIs
  //    - Specialized waste management databases
  // 
  // 3. Search Strategy by Category:
  //    - 'donate': donation center, goodwill, salvation army, charity shop
  //    - 'recycle': recycling center, recycling facility, waste management
  //    - 'hazardous': hazardous waste facility, electronics recycling, battery disposal
  //    - 'reuse': thrift store, second hand shop, upcycling center
  // 
  // 4. Data Processing:
  //    - Filter results by opening hours
  //    - Calculate accurate distances
  //    - Verify facility accepts specific waste types
  //    - Get contact information and ratings
  //
  
  try {
    // Example implementation outline for Google Places:
    // const placesApiKey = process.env.GOOGLE_PLACES_API_KEY
    // const radius = 10000 // 10km radius
    // const searchQueries = getSearchQueriesForCategory(category)
    // 
    // const results = []
    // for (const query of searchQueries) {
    //   const response = await fetch(
    //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    //     `location=${location.latitude},${location.longitude}&` +
    //     `radius=${radius}&` +
    //     `keyword=${encodeURIComponent(query)}&` +
    //     `key=${placesApiKey}`
    //   )
    //   const data = await response.json()
    //   results.push(...data.results)
    // }
    // 
    // return formatPlacesResponse(results, location)
    
    console.log(`Location services would search for ${category} disposal facilities near:`, location)
    
    // Return empty array until real location services are integrated
    return []
  } catch (error) {
    console.error('Error fetching nearby locations:', error)
    return []
  }
}

// Helper function that would be used with real location services
function getSearchQueriesForCategory(category: string): string[] {
  switch (category) {
    case 'donate':
      return ['donation center', 'goodwill', 'salvation army', 'charity shop']
    case 'recycle':
      return ['recycling center', 'recycling facility', 'waste management']
    case 'hazardous':
      return ['hazardous waste facility', 'electronics recycling', 'battery disposal']
    case 'reuse':
      return ['thrift store', 'second hand shop', 'upcycling center']
    default:
      return ['waste management', 'recycling center']
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Eco-scan API is running',
    timestamp: new Date().toISOString(),
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '10MB',
    locationServices: 'Ready for integration',
    aiModel: 'Gemini Pro Vision'
  })
}
