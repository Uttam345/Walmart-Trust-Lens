import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Walmart SmartScan Pro - Eco Scanner',
  },
})

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

    // Analyze image with OpenRouter
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
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image',
    }, { status: 500 })
  }
}

async function analyzeImageForEcoScanning(base64Image: string, mimeType: string): Promise<EcoScanResult> {
  const systemPrompt = `You are an expert eco-scanner AI that analyzes images of items to determine their disposal category and environmental impact. 

Analyze the uploaded image carefully and determine:
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

Important: 
- Examine image quality, lighting, and clarity to provide accurate assessment
- If image is blurry or unclear, mention this and provide general guidance
- Give confidence score based on image clarity and item recognition
- Provide specific, actionable recommendations
- Consider local regulations and best practices

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
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this image for eco-scanning. Examine the item carefully for condition, material, brand markings, damage, and any other relevant details. Provide detailed disposal recommendations based on what you observe.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('AI Response format error:', responseText)
      throw new Error('Invalid response format from AI')
    }

    const result = JSON.parse(jsonMatch[0]) as EcoScanResult
    
    // Validate required fields
    if (!result.itemName || !result.category || !result.condition) {
      console.error('Incomplete analysis result:', result)
      throw new Error('Incomplete analysis result')
    }

    // Ensure confidence is within valid range
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.8
    }

    return result

  } catch (error) {
    console.error('AI Analysis Error:', error)
    // Enhanced fallback response
    return {
      itemName: 'Unknown Item - Image Analysis Failed',
      category: 'waste',
      condition: 'fair',
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
    aiModel: 'Claude 3.5 Sonnet'
  })
}
