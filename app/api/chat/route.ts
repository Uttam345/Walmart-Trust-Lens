import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    'X-Title': 'Walmart TrustLens',
  },
})

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
  
  // Product searches
  if (/looking for|need|want|find|search|buy|purchase|shopping/.test(message)) {
    return fallbackResponses.products[Math.floor(Math.random() * fallbackResponses.products.length)]
  }
  
  // Default response
  return "I'm currently experiencing some technical difficulties with my advanced features, but I'm still here to help! Could you tell me more about what you're shopping for? I can provide basic assistance with product searches and shopping advice."
}

export async function POST(request: NextRequest) {
  let requestMessages: any[] = []
  
  try {
    const { messages, context } = await request.json()
    requestMessages = messages || []

    // System prompt for Walmart shopping assistant
    const systemPrompt = `You are an AI shopping assistant for Walmart TrustLens, a transparent shopping app that helps users make informed purchasing decisions with trust and transparency.

Your capabilities include:
- Helping users find products and compare prices
- Providing product recommendations based on user preferences
- Explaining product features, benefits, and specifications
- Analyzing product reviews and ratings
- Suggesting alternatives or complementary products
- Helping with budgeting and cost-effective shopping
- Providing information about sustainability and eco-friendly options
- Answering questions about product availability and store locations

Context: ${context ? JSON.stringify(context) : 'General shopping assistance'}

Guidelines:
- Be helpful, friendly, and concise
- Focus on practical shopping advice
- Consider user's budget and preferences
- Highlight value for money and quality
- Mention social proof when relevant (reviews, ratings, popularity)
- Suggest sustainable options when appropriate
- Ask clarifying questions to better understand user needs
- If you don't have specific product information, acknowledge this and suggest how the user can find it

Respond in a conversational, helpful manner as a knowledgeable shopping assistant.`

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet for high-quality responses
      messages: [
        { role: 'system', content: systemPrompt },
        ...requestMessages.map((msg: any) => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: String(msg.content),
        })),
      ],
      temperature: 0.7,
      max_tokens: 500, // Reduced from 1000 to prevent credit issues
      stream: false,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request. Please try again.'

    return NextResponse.json({
      success: true,
      message: aiResponse,
      model: 'anthropic/claude-3.5-sonnet',
    })

  } catch (error) {
    console.error('OpenRouter API Error:', error)
    
    // Get the last user message for fallback response
    const lastUserMessage = requestMessages?.filter((m: any) => m.type === 'user')?.pop()
    const userMessageContent = lastUserMessage?.content || ''
    
    // Use intelligent fallback based on user message
    const fallbackResponse = getFallbackResponse(userMessageContent)
    
    return NextResponse.json({
      success: true, // Still return success to show fallback message normally
      message: fallbackResponse,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'AI Chat API is running',
    timestamp: new Date().toISOString(),
    model: 'anthropic/claude-3.5-sonnet',
  })
}
