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

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

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

Analyze the uploaded image and determine:
1. What is the item?
2. What condition is it in?
3. What's the best disposal/reuse method?
4. Environmental impact considerations
5. Specific disposal recommendations

Categories:
- "donate": Items in good condition that can be donated (clothes, electronics, furniture, books)
- "recycle": Items that can be recycled (bottles, cans, paper, certain plastics)
- "reuse": Items that can be repurposed or upcycled
- "waste": Items that must go to regular trash
- "hazardous": Items requiring special disposal (batteries, chemicals, electronics with toxic materials)

Conditions:
- "excellent": Like new, perfect for donation
- "good": Minor wear, still very usable
- "fair": Noticeable wear but functional
- "poor": Heavily worn, likely only recyclable
- "hazardous": Contains dangerous materials

Provide your response as a JSON object with these exact fields:
{
  "itemName": "name of the item",
  "category": "donate|recycle|waste|reuse|hazardous",
  "condition": "excellent|good|fair|poor|hazardous",
  "confidence": 0.0-1.0,
  "analysis": "detailed analysis of the item and its condition",
  "recommendations": ["specific action recommendations"],
  "environmentalImpact": "environmental impact description",
  "disposalMethod": "detailed disposal instructions",
  "tips": ["helpful tips for disposal or preparation"]
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
              text: 'Please analyze this image for eco-scanning and provide disposal recommendations.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI')
    }

    const result = JSON.parse(jsonMatch[0]) as EcoScanResult
    
    // Validate required fields
    if (!result.itemName || !result.category || !result.condition) {
      throw new Error('Incomplete analysis result')
    }

    return result

  } catch (error) {
    console.error('AI Analysis Error:', error)
    // Fallback response
    return {
      itemName: 'Unknown Item',
      category: 'waste',
      condition: 'fair',
      confidence: 0.5,
      analysis: 'Unable to analyze the image clearly. Please ensure the item is well-lit and clearly visible.',
      recommendations: ['Contact local waste management for guidance', 'Consider if item can be cleaned or repaired'],
      environmentalImpact: 'Proper disposal helps reduce environmental impact',
      disposalMethod: 'Check local waste management guidelines',
      tips: ['Take a clearer photo for better analysis', 'Ensure good lighting when scanning items']
    }
  }
}

async function getNearbyDisposalLocations(location: LocationData, category: string): Promise<DisposalLocation[]> {
  // Mock location data - in production, integrate with Google Places API or similar
  const mockLocations = {
    donate: [
      {
        name: 'Goodwill Donation Center',
        address: '123 Charity Lane',
        distance: '0.8 miles',
        hours: 'Mon-Sat 9AM-7PM',
        phone: '(555) 123-4567',
        acceptedItems: ['Clothing', 'Electronics', 'Household Items', 'Books'],
        rating: 4.5,
        type: 'donation'
      },
      {
        name: 'Salvation Army Store',
        address: '456 Hope Street',
        distance: '1.2 miles',
        hours: 'Daily 8AM-6PM',
        phone: '(555) 234-5678',
        acceptedItems: ['Furniture', 'Clothing', 'Appliances', 'Toys'],
        rating: 4.3,
        type: 'donation'
      },
      {
        name: 'Local Community Center',
        address: '789 Community Dr',
        distance: '1.5 miles',
        hours: 'Mon-Fri 10AM-5PM',
        acceptedItems: ['Books', 'School Supplies', 'Clothing'],
        rating: 4.7,
        type: 'donation'
      }
    ],
    recycle: [
      {
        name: 'City Recycling Center',
        address: '321 Green Avenue',
        distance: '0.5 miles',
        hours: 'Mon-Fri 8AM-5PM, Sat 9AM-3PM',
        phone: '(555) 345-6789',
        acceptedItems: ['Paper', 'Cardboard', 'Glass', 'Metal', 'Plastic'],
        rating: 4.2,
        type: 'recycling'
      },
      {
        name: 'EcoCenter Recycling Hub',
        address: '654 Earth Way',
        distance: '1.1 miles',
        hours: 'Daily 7AM-7PM',
        phone: '(555) 456-7890',
        acceptedItems: ['Electronics', 'Batteries', 'Plastic', 'Metal'],
        rating: 4.6,
        type: 'recycling'
      }
    ],
    hazardous: [
      {
        name: 'Municipal Hazardous Waste Facility',
        address: '987 Safe Disposal Road',
        distance: '2.3 miles',
        hours: 'Sat 8AM-2PM (Appointment Required)',
        phone: '(555) 567-8901',
        acceptedItems: ['Batteries', 'Paint', 'Chemicals', 'Electronics', 'Fluorescent Bulbs'],
        rating: 4.4,
        type: 'hazardous'
      },
      {
        name: 'Best Buy Electronics Recycling',
        address: '147 Tech Plaza',
        distance: '1.7 miles',
        hours: 'Mon-Sat 10AM-8PM, Sun 11AM-6PM',
        phone: '(555) 678-9012',
        acceptedItems: ['Electronics', 'Batteries', 'Cables', 'Small Appliances'],
        rating: 4.1,
        type: 'electronics'
      }
    ]
  }

  // Return locations based on category, defaulting to general recycling
  return mockLocations[category as keyof typeof mockLocations] || mockLocations.recycle
}

export async function GET() {
  return NextResponse.json({
    status: 'Eco-scan API is running',
    timestamp: new Date().toISOString(),
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '10MB',
  })
}
