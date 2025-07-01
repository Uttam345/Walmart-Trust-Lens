import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    'X-Title': 'Walmart SmartScan Pro',
  },
})

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    // System prompt for Walmart shopping assistant
    const systemPrompt = `You are an AI shopping assistant for Walmart SmartScan Pro, a smart shopping app that helps users make informed purchasing decisions.

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
        ...messages.map((msg: any) => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
    
    // Fallback response
    const fallbackResponse = "I'm sorry, I'm having trouble connecting to my AI services right now. However, I'm here to help you with your shopping needs! Could you tell me what specific product or category you're looking for?"

    return NextResponse.json({
      success: false,
      message: fallbackResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'AI Chat API is running',
    timestamp: new Date().toISOString(),
    model: 'anthropic/claude-3.5-sonnet',
  })
}
