import { NextRequest, NextResponse } from 'next/server'
import { getChatModel, getFlashModel, validateGeminiEnvironment } from '@/lib/gemini'

// Validate environment variables
try {
  validateGeminiEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}

// Fallback responses for common shopping queries
const fallbackResponses = {
  greeting: [
    "Hello! I'm your Walmart shopping assistant. I can help you find products, compare prices, and make smart shopping decisions. What are you looking for today?",
    "Hi there! I'm here to help you with your shopping needs. Whether you're looking for specific products or need recommendations, just let me know!",
    "Welcome! I can assist you with finding products, checking prices, and getting shopping advice. How can I help you today?"
  ],
  help: [
    "I can help you with:\n• Finding and comparing products\n• Getting price information\n• Product recommendations\n• Reading reviews and ratings\n• Finding deals and discounts\n• Sustainable shopping options\n\nWhat would you like to know?",
    "Here's what I can do for you:\n• Search for specific products\n• Compare different brands and prices\n• Suggest alternatives based on your budget\n• Help you find the best deals\n• Provide product information and reviews\n\nJust tell me what you're shopping for!"
  ],
  products: [
    "I'd be happy to help you find products! Could you tell me more specifically what you're looking for? For example: electronics, clothing, groceries, home goods, etc.?",
    "What type of product are you interested in? I can help you find the best options based on your needs and budget.",
    "Let me help you find what you need! Please describe the product you're looking for, and I'll provide recommendations and information."
  ],
  electronics: [
    "For electronics at Walmart, I recommend checking:\n• Latest smartphones and tablets\n• Laptops and computers\n• TVs and entertainment systems\n• Gaming consoles and accessories\n• Smart home devices\n\nWhat specific electronics are you interested in?"
  ],
  groceries: [
    "Walmart has great grocery options:\n• Fresh produce and organic foods\n• Pantry essentials and bulk items\n• Frozen and refrigerated items\n• International and specialty foods\n• Health and wellness products\n\nWhat groceries do you need?"
  ],
  clothing: [
    "Walmart offers affordable clothing options:\n• Men's, women's, and children's apparel\n• Seasonal and work clothing\n• Shoes and accessories\n• Plus-size and specialty fits\n• Brand names at great prices\n\nWhat type of clothing are you shopping for?"
  ],
  budget: [
    "I can help you find great deals and budget-friendly options! Walmart offers:\n• Rollback prices and special offers\n• Great Value brand products\n• Bulk buying options\n• Price matching on select items\n\nWhat's your budget range, and what are you looking to buy?"
  ],
  sustainability: [
    "Walmart has many sustainable options:\n• Eco-friendly products and packaging\n• Organic and locally-sourced items\n• Energy-efficient appliances\n• Sustainable clothing brands\n• Recyclable and biodegradable products\n\nWhat sustainable products interest you?"
  ]
}

function getFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(message)) {
    return fallbackResponses.greeting[Math.floor(Math.random() * fallbackResponses.greeting.length)]
  }
  
  // Help requests
  if (/help|what can you do|how can you help|capabilities/.test(message)) {
    return fallbackResponses.help[Math.floor(Math.random() * fallbackResponses.help.length)]
  }
  
  // Electronics
  if (/phone|laptop|computer|tv|electronics|gaming|console|tablet|smartphone/.test(message)) {
    return fallbackResponses.electronics[Math.floor(Math.random() * fallbackResponses.electronics.length)]
  }
  
  // Groceries
  if (/food|grocery|groceries|milk|bread|fruit|vegetable|meat|dairy|organic/.test(message)) {
    return fallbackResponses.groceries[Math.floor(Math.random() * fallbackResponses.groceries.length)]
  }
  
  // Clothing
  if (/clothes|clothing|shirt|pants|dress|shoes|jacket|apparel|fashion/.test(message)) {
    return fallbackResponses.clothing[Math.floor(Math.random() * fallbackResponses.clothing.length)]
  }
  
  // Budget-related
  if (/cheap|budget|affordable|deal|discount|save|money|price/.test(message)) {
    return fallbackResponses.budget[Math.floor(Math.random() * fallbackResponses.budget.length)]
  }
  
  // Sustainability
  if (/sustainable|eco|environment|green|organic|eco-friendly|carbon/.test(message)) {
    return fallbackResponses.sustainability[Math.floor(Math.random() * fallbackResponses.sustainability.length)]
  }
  
  // Product searches
  if (/looking for|need|want|find|search|buy|purchase|shopping/.test(message)) {
    return fallbackResponses.products[Math.floor(Math.random() * fallbackResponses.products.length)]
  }
  
  // Default response
  return "I'm currently running in basic mode with limited AI features, but I can still help with your shopping needs! Tell me what you're looking for - whether it's electronics, groceries, clothing, or anything else - and I'll do my best to assist you with product information and recommendations."
}

export async function POST(request: NextRequest) {
  let requestData: any
  
  try {
    // Parse request data first and store it
    requestData = await request.json()
    const { messages, context } = requestData
    const requestMessages = messages || []
    
    // Check if API key is properly configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not properly configured, using fallback mode')
      
      const lastUserMessage = requestMessages?.filter((m: any) => m.type === 'user')?.pop()
      const userMessageContent = lastUserMessage?.content || ''
      
      const fallbackResponse = getFallbackResponse(userMessageContent)
      
      return NextResponse.json({
        success: true,
        message: fallbackResponse,
        fallback: true,
        model: 'gemini-fallback',
        error: 'API key not configured',
      })
    }

    if (!requestMessages.length) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      )
    }

    const model = getFlashModel() // Use Flash model instead of Pro for higher quotas

    // System prompt for TrustLens AI
    const systemPrompt = `You are TrustLens AI, Walmart's trusted shopping assistant. You help customers make informed purchasing decisions by:

1. **Product Analysis**: Analyze products for quality, value, and trustworthiness
2. **Price Comparison**: Help find the best deals and value propositions  
3. **Safety & Reviews**: Highlight safety concerns and authentic customer feedback
4. **Sustainability**: Provide eco-friendly and sustainable product alternatives
5. **Personalized Recommendations**: Suggest products based on user preferences and needs

Always be helpful, honest, and focused on building customer trust. If you're unsure about something, say so rather than guessing.

Context: ${context ? JSON.stringify(context) : 'General shopping assistance'}

Guidelines:
- Be concise but informative
- Focus on transparency and trust
- Consider budget and value
- Highlight authentic reviews and social proof
- Suggest sustainable alternatives when relevant
- Ask clarifying questions when needed
- Admit limitations and suggest verification methods

Respond as a knowledgeable, trustworthy shopping assistant.`

    // Format messages for Gemini
    const chatHistory = requestMessages.slice(0, -1).map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Get the latest user message
    const latestMessage = requestMessages[requestMessages.length - 1]
    
    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I\'m TrustLens AI, ready to help you make informed shopping decisions at Walmart with transparency and trust. How can I assist you today?' }],
        },
        ...chatHistory,
      ],
    })

    // Try to send message with simple retry for rate limits
    let result
    try {
      result = await chat.sendMessage(latestMessage.content)
    } catch (apiError: any) {
      // If rate limited, wait a moment and try with a shorter prompt
      if (apiError.message?.includes('429') || apiError.message?.includes('quota')) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        // Try with a simpler chat without full history
        const simpleChat = model.startChat({
          history: [
            {
              role: 'user', 
              parts: [{ text: 'You are a helpful Walmart shopping assistant. Be concise and helpful.' }],
            },
            {
              role: 'model',
              parts: [{ text: 'I\'m ready to help with your Walmart shopping needs!' }],
            },
          ],
        })
        result = await simpleChat.sendMessage(latestMessage.content)
      } else {
        throw apiError
      }
    }

    const response = await result.response
    const aiResponse = response.text()

    return NextResponse.json({
      success: true,
      message: aiResponse,
      model: 'gemini-1.5-flash',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Gemini Chat API Error:', error)
    
    // Get the last user message for fallback response from stored request data
    let userMessageContent = ''
    try {
      if (requestData?.messages) {
        const lastUserMessage = requestData.messages.filter((m: any) => m.type === 'user')?.pop()
        userMessageContent = lastUserMessage?.content || ''
      }
    } catch (parseError) {
      console.warn('Could not extract user message for fallback:', parseError)
    }
    
    // Check for specific quota/rate limit errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    let fallbackMessage = ''
    
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      fallbackMessage = "I'm experiencing high demand right now and have hit API rate limits. Let me help you with some basic shopping guidance instead! " + getFallbackResponse(userMessageContent)
    } else {
      fallbackMessage = getFallbackResponse(userMessageContent)
    }
    
    return NextResponse.json({
      success: true,
      message: fallbackMessage,
      fallback: true,
      model: 'gemini-fallback',
      error: errorMessage,
    })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'TrustLens AI Chat API is running',
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-pro',
    provider: 'Google Gemini',
  })
}
