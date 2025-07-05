import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Walmart SmartScan Pro - Health Check',
  },
})

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'OPENROUTER_API_KEY not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test a simple API call
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'user',
          content: 'Respond with just the word "OK" if you can see this message.'
        }
      ],
      max_tokens: 10,
    })

    const content = response.choices[0]?.message?.content

    return NextResponse.json({
      status: 'healthy',
      message: 'OpenRouter API is working',
      apiResponse: content,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'OpenRouter API health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
