import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Walmart TrustLens - Product Scanner',
  },
})

interface ProductScanResult {
  productName: string
  description: string
  category: string
  estimatedPrice: string
  features: string[]
  benefits: string[]
  usage: string
  whereToFind: string[]
  alternatives: Array<{
    name: string
    price: string
    reason: string
  }>
  buyingTips: string[]
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured')
      return NextResponse.json({
        success: false,
        error: 'API key not configured. Please set OPENROUTER_API_KEY environment variable.'
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

    // Create the AI prompt for product analysis
    const prompt = `You are a shopping assistant AI. Analyze this product image and provide detailed information to help the user make an informed purchase decision.

Please identify:
1. What the product is (name and description)
2. Product category
3. Estimated price range at Walmart
4. Key features and benefits
5. How to use it / what it's for
6. Where to find it in store (department/aisle)
7. Similar alternatives with prices
8. Buying tips and considerations

Provide the response in a JSON format with these exact fields:
{
  "productName": "string",
  "description": "string", 
  "category": "string",
  "estimatedPrice": "string (e.g., '$5.99 - $8.99')",
  "features": ["array of key features"],
  "benefits": ["array of benefits"],
  "usage": "string describing how to use",
  "whereToFind": ["array of store locations like 'Electronics Department', 'Aisle 12'"],
  "alternatives": [{"name": "string", "price": "string", "reason": "string"}],
  "buyingTips": ["array of helpful buying tips"],
  "confidence": number (0-100)
}

Be helpful, accurate, and focus on providing actionable shopping advice.`

    // Call OpenRouter API with Claude 3.5 Sonnet
    console.log('Calling OpenRouter API...')
    
    try {
      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
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
        max_tokens: 1500,
        temperature: 0.7,
      })

      console.log('OpenRouter API response received')
      const aiResponse = response.choices[0]?.message?.content
      
      if (!aiResponse) {
        console.error('No response content from AI')
        throw new Error('No response from AI')
      }

      // Parse the JSON response from AI
      let scanResult: ProductScanResult
      try {
        scanResult = JSON.parse(aiResponse)
      } catch (parseError) {
        console.warn('AI response parsing failed, using fallback:', parseError)
        // If JSON parsing fails, create a fallback response
        scanResult = {
          productName: "Product Detected",
          description: "Product identified in image",
          category: "General",
          estimatedPrice: "$5.99 - $19.99",
          features: ["Quality product", "Available at Walmart"],
          benefits: ["Convenient", "Good value"],
          usage: "As intended by manufacturer",
          whereToFind: ["Various departments"],
          alternatives: [
            { name: "Similar product", price: "$4.99", reason: "Budget option" }
          ],
          buyingTips: ["Check reviews", "Compare prices"],
          confidence: 75
        }
      }

      // Generate mock social proof data
      const socialProof = {
        friendsPurchased: Math.floor(Math.random() * 10) + 1,
        friendsRecommend: Math.floor(Math.random() * 30) + 70,
        locationPopularity: Math.floor(Math.random() * 20) + 60,
        userClassPreference: Math.floor(Math.random() * 20) + 80,
        trendingScore: Math.floor(Math.random() * 30) + 70,
        recentActivity: `${Math.floor(Math.random() * 200) + 50} people scanned this in the last hour`,
      }

      const friends = [
        { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
        { name: "Mike R.", avatar: "/placeholder.svg?height=32&width=32", action: "recommended", timeAgo: "1 week ago" },
        { name: "Sarah L.", avatar: "/placeholder.svg?height=32&width=32", action: "reviewed", timeAgo: "3 days ago" },
      ]

      return NextResponse.json({
        success: true,
        data: {
          ...scanResult,
          rating: 4.0 + Math.random() * 1, // Random rating between 4.0-5.0
          reviews: Math.floor(Math.random() * 2000) + 100,
          socialProof,
          friends,
          id: `ai-scan-${Date.now()}`,
          image: `data:${mimeType};base64,${base64Image}`
        }
      })
      
    } catch (apiError) {
      console.error('OpenRouter API error:', apiError)
      
      // If AI fails, return a fallback response instead of throwing
      console.log('Using fallback response due to AI API failure')
      
      const fallbackResult: ProductScanResult = {
        productName: "Product Detected",
        description: "AI analysis temporarily unavailable. Basic product information provided.",
        category: "General",
        estimatedPrice: "$5.99 - $19.99",
        features: ["Quality product", "Available at Walmart", "Please check product details"],
        benefits: ["Convenient shopping", "Good value"],
        usage: "Please refer to product packaging for usage instructions",
        whereToFind: ["Various departments", "Ask store associate for location"],
        alternatives: [
          { name: "Similar products available", price: "Varies", reason: "Compare in store" }
        ],
        buyingTips: ["Check product reviews", "Compare prices", "Ask store associate for recommendations"],
        confidence: 60
      }

      const socialProof = {
        friendsPurchased: Math.floor(Math.random() * 10) + 1,
        friendsRecommend: Math.floor(Math.random() * 30) + 70,
        locationPopularity: Math.floor(Math.random() * 20) + 60,
        userClassPreference: Math.floor(Math.random() * 20) + 80,
        trendingScore: Math.floor(Math.random() * 30) + 70,
        recentActivity: `${Math.floor(Math.random() * 200) + 50} people scanned this in the last hour`,
      }

      const friends = [
        { name: "Emma W.", avatar: "/placeholder.svg?height=32&width=32", action: "bought", timeAgo: "2 days ago" },
        { name: "Mike R.", avatar: "/placeholder.svg?height=32&width=32", action: "recommended", timeAgo: "1 week ago" },
        { name: "Sarah L.", avatar: "/placeholder.svg?height=32&width=32", action: "reviewed", timeAgo: "3 days ago" },
      ]

      return NextResponse.json({
        success: true,
        data: {
          ...fallbackResult,
          rating: 4.0 + Math.random() * 1,
          reviews: Math.floor(Math.random() * 2000) + 100,
          socialProof,
          friends,
          id: `fallback-scan-${Date.now()}`,
          image: `data:${mimeType};base64,${base64Image}`,
          aiError: true // Flag to indicate fallback was used
        }
      })
    }

  } catch (error) {
    console.error('Product scan error:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Check for specific OpenRouter errors
    let errorMessage = 'Failed to analyze product image'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage = 'API authentication failed. Please check your OpenRouter API key.'
        statusCode = 401
      } else if (error.message.includes('429')) {
        errorMessage = 'API rate limit exceeded. Please try again later.'
        statusCode = 429
      } else if (error.message.includes('insufficient_quota')) {
        errorMessage = 'API quota exceeded. Please check your OpenRouter account.'
        statusCode = 402
      }
    }
    
    // Return a helpful error response
    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}
