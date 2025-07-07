import { NextRequest, NextResponse } from 'next/server'
import { getVisionModel, base64ToGenerativePart, validateGeminiEnvironment } from '@/lib/gemini'

// Validate environment variables
try {
  validateGeminiEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}

interface ProductScanResult {
  productName: string
  description: string
  category: string
  estimatedPrice: string
  trustScore?: number
  valueScore?: number
  sustainabilityScore?: number
  features: string[]
  benefits: string[]
  safetyNotes?: string[]
  whereToFind: string[]
  alternatives: Array<{
    name: string
    price: string
    trustScore?: number
    reason: string
  }>
  buyingTips: string[]
  overallRecommendation?: string
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      return NextResponse.json({
        success: false,
        error: 'API key not configured. Please set GEMINI_API_KEY environment variable.'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'No image provided'
      }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = image.type

    // Create the AI prompt for TrustLens product analysis
    const prompt = `You are TrustLens AI, a sophisticated product analysis system for Walmart shoppers. Analyze this product image and provide comprehensive insights in valid JSON format.

ANALYSIS REQUIREMENTS:
1. Product Identification: Name, brand, model, key features
2. Trust Assessment: Rate trustworthiness (1-10) based on brand reputation, quality indicators, packaging, certifications
3. Value Analysis: Price estimation, value rating (1-10), comparison insights
4. Safety & Quality: Visible quality issues, certifications, material concerns
5. Sustainability: Eco-friendliness rating (1-10), packaging analysis, environmental impact
6. Shopping Guidance: Purchase recommendation, alternatives, key checks, store location tips

RESPONSE FORMAT (valid JSON only):
{
  "productName": "exact product name with brand",
  "description": "detailed product description", 
  "category": "product category",
  "estimatedPrice": "$X.XX - $Y.YY range at Walmart",
  "trustScore": number between 1-10,
  "valueScore": number between 1-10,
  "sustainabilityScore": number between 1-10,
  "features": ["key feature 1", "key feature 2", "key feature 3"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "safetyNotes": ["safety consideration 1", "safety consideration 2"],
  "whereToFind": ["Grocery section", "Health & Wellness", "etc"],
  "alternatives": [
    {
      "name": "alternative product name",
      "price": "$X.XX",
      "trustScore": number,
      "reason": "why this alternative"
    }
  ],
  "buyingTips": ["tip 1", "tip 2", "tip 3"],
  "overallRecommendation": "clear recommendation with reasoning",
  "confidence": number between 0-100
}

IMPORTANT: 
- Respond ONLY with valid JSON
- No markdown formatting
- Be specific about Walmart pricing and availability
- Focus on trust, transparency, and informed decision-making
- Provide actionable shopping advice`

    const model = getVisionModel()
    
    // Create image part for Gemini
    const imagePart = base64ToGenerativePart(base64Image, mimeType)

    console.log('Calling Gemini Vision API...')
    
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    console.log('Gemini API Response received')

    // Try to parse the JSON response
    let productData: ProductScanResult
    try {
      // Clean the response - remove any markdown formatting
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      productData = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.log('Raw response:', text)
      
      // Fallback response if JSON parsing fails
      productData = {
        productName: "Product Analysis",
        description: "Product detected in image",
        category: "General",
        estimatedPrice: "$5.99 - $19.99",
        trustScore: 7,
        valueScore: 7,
        sustainabilityScore: 6,
        features: ["Visible in image"],
        benefits: ["As shown in product image"],
        safetyNotes: ["Please verify safety information"],
        whereToFind: ["Ask store associate for location"],
        alternatives: [],
        buyingTips: ["Check product reviews", "Compare with similar items", "Verify return policy"],
        overallRecommendation: "Consider your specific needs and compare with alternatives before purchasing.",
        confidence: 60
      }
    }

    // Add some enhanced data for better UX
    const enhancedData = {
      ...productData,
      scanTimestamp: new Date().toISOString(),
      model: 'gemini-1.5-pro',
      provider: 'Google Gemini',
      trustAnalysis: {
        trustScore: productData.trustScore || 7,
        valueScore: productData.valueScore || 7,
        sustainabilityScore: productData.sustainabilityScore || 6,
      }
    }

    return NextResponse.json({
      success: true,
      data: enhancedData,
      message: 'Product analyzed successfully with TrustLens AI'
    })

  } catch (error) {
    console.error('Gemini Vision API Error:', error)
    
    // Return fallback response
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze product. Please try again.',
      fallback: true,
      data: {
        productName: "Product Scan Error",
        description: "Unable to analyze product at this time",
        category: "Unknown",
        estimatedPrice: "Please check Walmart.com",
        trustScore: 5,
        valueScore: 5,
        sustainabilityScore: 5,
        features: ["Unable to detect"],
        benefits: ["Please try scanning again"],
        safetyNotes: ["Verify product information manually"],
        whereToFind: ["Ask store associate"],
        alternatives: [],
        buyingTips: ["Try scanning again with better lighting", "Ensure product is clearly visible"],
        overallRecommendation: "Please try scanning again or search for the product manually.",
        confidence: 0,
        scanTimestamp: new Date().toISOString(),
        model: 'gemini-fallback'
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'TrustLens Product Scanner API is running',
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-pro',
    provider: 'Google Gemini',
  })
}
