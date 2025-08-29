UttamBansal-67: explain the whole code line by line for best understanding

GitHub Copilot: I'll explain this barcode lookup API route code line by line for comprehensive understanding:

## Import Statements
```typescript
import { NextRequest, NextResponse } from 'next/server';
```
- Imports Next.js server utilities for handling HTTP requests and responses
- `NextRequest` - represents incoming HTTP request
- `NextResponse` - used to create HTTP responses

## Function Declaration
```typescript
export async function GET(request: NextRequest) {
```
- Exports an async function to handle GET requests
- In Next.js App Router, this creates an API endpoint
- The function will be called when someone makes a GET request to `/api/barcode-lookup`

## Extract Query Parameters
```typescript
const { searchParams } = new URL(request.url);
const barcode = searchParams.get('barcode');
```
- Creates a URL object from the request URL
- Extracts search parameters (query string parameters)
- Gets the 'barcode' parameter value from the URL (e.g., `?barcode=123456789`)

## Input Validation
```typescript
if (!barcode) {
  return NextResponse.json(
    { error: 'Barcode parameter is required' },
    { status: 400 }
  );
}
```
- Checks if barcode parameter exists
- Returns a 400 Bad Request error with JSON message if missing
- Validates user input before proceeding

## Error Handling Block
```typescript
try {
```
- Starts a try-catch block to handle potential errors gracefully

## API Key Validation
```typescript
const apiKey = process.env.NEXT_PUBLIC_BARCODE_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: 'API key not configured' },
    { status: 500 }
  );
}
```
- Retrieves API key from environment variables
- Checks if API key exists in configuration
- Returns 500 Internal Server Error if API key is missing

## External API Call
```typescript
const response = await fetch(
  `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${apiKey}`
);
```
- Makes HTTP request to barcodelookup.com API
- Passes the barcode, formatting option, and API key as parameters
- Uses template literals to construct the URL

## API Response Validation
```typescript
if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();
```
- Checks if the API response was successful (status 200-299)
- Throws an error if the request failed
- Parses the JSON response data

## Successful Product Found
```typescript
if (data.products && data.products.length > 0) {
  const product = data.products[0];
```
- Checks if the API returned any products
- Takes the first product from the results array

## Data Transformation
```typescript
const transformedProduct = {
  id: product.barcode_number || barcode,
  name: product.title || 'Unknown Product',
  price: product.stores?.[0]?.store_price || 'Price not available',
  rating: 4.5,
  reviews: Math.floor(Math.random() * 5000 + 100),
  image: product.images?.[0] || '/placeholder.svg?height=120&width=120',
  barcode: product.barcode_number || barcode,
  brand: product.brand || 'Unknown Brand',
  category: product.category || 'General',
  description: product.description || 'No description available',
  socialProof: {
    friendsPurchased: Math.floor(Math.random() * 25),
    friendsRecommend: Math.floor(Math.random() * 40 + 60),
    locationPopularity: Math.floor(Math.random() * 30 + 50),
    trendingScore: Math.floor(Math.random() * 50 + 30),
  },
};
```
- Transforms external API data into internal format
- Uses optional chaining (`?.`) to safely access nested properties
- Uses logical OR (`||`) for fallback values
- Generates mock social proof data with random numbers
- Creates consistent data structure for the frontend

## Mock Product Fallback
```typescript
} else {
  const mockProduct = {
    // Similar structure with mock data
  };
  return NextResponse.json({ product: mockProduct });
}
```
- Handles case where API returns no products
- Creates a mock product with generated data
- Ensures the API always returns a product object

## Error Handling
```typescript
} catch (error) {
  console.error('Barcode lookup error:', error);
  
  const fallbackProduct = {
    // Fallback product structure
  };
  
  return NextResponse.json({ product: fallbackProduct });
}
```
- Catches any errors that occur during the process
- Logs the error for debugging
- Returns a fallback product to maintain user experience
- Prevents the application from crashing

## Key Features:
1. **Graceful Degradation** - Always returns a product, even on errors
2. **Input Validation** - Validates required parameters
3. **Error Handling** - Comprehensive error management
4. **Data Transformation** - Converts external API format to internal format
5. **Mock Data Generation** - Provides realistic fallback data
6. **Consistent Response** - Always returns the same data structure

This API endpoint ensures a reliable user experience by handling all possible scenarios and always providing product data.

UttamBansal-67: explain the whole code line by line for best understanding

GitHub Copilot: I'll explain this chat API route code line by line for comprehensive understanding:

## Import Statements
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getChatModel, getFlashModel, validateGeminiEnvironment } from '@/lib/gemini'
```
- Imports Next.js server utilities for handling HTTP requests and responses
- Imports custom Gemini AI functions from a local library file
- `getChatModel`, `getFlashModel` - functions to initialize AI models
- `validateGeminiEnvironment` - validates API configuration

## Environment Validation
```typescript
try {
  validateGeminiEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
}
```
- Immediately validates that Gemini API environment is properly configured
- Logs any configuration errors but doesn't stop execution
- Allows the app to continue with fallback functionality

## Fallback Response System
```typescript
const fallbackResponses = {
  greeting: [
    "Hello! I'm your Walmart shopping assistant...",
    // Multiple response variations
  ],
  help: [
    "I can help you with:\n• Finding and comparing products...",
    // Multiple help responses
  ],
  // ... more categories
}
```
- Defines pre-written responses for when AI is unavailable
- Each category has multiple response variations for natural conversation
- Covers common shopping scenarios: greetings, help, products, electronics, etc.
- Ensures users always get helpful responses even without AI

## Fallback Response Logic
```typescript
function getFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(message)) {
    return fallbackResponses.greeting[Math.floor(Math.random() * fallbackResponses.greeting.length)]
  }
```
- Takes user message and converts to lowercase for pattern matching
- Uses regex patterns to identify user intent
- Returns random response from appropriate category for variety
- `Math.floor(Math.random() * array.length)` - selects random response

## Pattern Matching for Different Intents
```typescript
// Help requests
if (/help|what can you do|how can you help|capabilities/.test(message)) {
  return fallbackResponses.help[Math.floor(Math.random() * fallbackResponses.help.length)]
}

// Electronics
if (/phone|laptop|computer|tv|electronics|gaming|console|tablet|smartphone/.test(message)) {
  return fallbackResponses.electronics[Math.floor(Math.random() * fallbackResponses.electronics.length)]
}
```
- Each category has specific keywords to match against
- Uses regex with multiple keywords separated by `|` (OR operator)
- Returns category-specific responses for better user experience

## POST Request Handler
```typescript
export async function POST(request: NextRequest) {
  let requestData: any
  
  try {
    // Parse request data first and store it
    requestData = await request.json()
    const { messages, context } = requestData
    const requestMessages = messages || []
```
- Handles POST requests to the chat endpoint
- Declares `requestData` outside try block for error handling access
- Parses JSON body from request
- Extracts `messages` (conversation history) and `context` (additional info)
- Uses fallback empty array if no messages provided

## API Key Validation
```typescript
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
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
```
- Checks if API key exists and isn't the placeholder value
- If invalid, extracts last user message from conversation
- Uses `?.` (optional chaining) to safely access nested properties
- Calls fallback response function with user's message
- Returns JSON response indicating fallback mode was used

## Message Validation
```typescript
if (!requestMessages.length) {
  return NextResponse.json(
    { error: 'No messages provided' },
    { status: 400 }
  )
}
```
- Validates that at least one message was provided
- Returns 400 Bad Request error if no messages found

## AI Model Initialization
```typescript
const model = getFlashModel() // Use Flash model instead of Pro for higher quotas
```
- Initializes Gemini Flash model (faster, higher quota than Pro model)
- Comment explains choice for better rate limit handling

## System Prompt Definition
```typescript
const systemPrompt = `You are TrustLens AI, Walmart's trusted shopping assistant. You help customers make informed purchasing decisions by:

1. **Product Analysis**: Analyze products for quality, value, and trustworthiness
2. **Price Comparison**: Help find the best deals and value propositions  
// ... more instructions
`
```
- Defines AI personality and capabilities
- Uses template literal for multi-line string
- Includes specific guidelines for behavior and responses
- Sets context about being a Walmart shopping assistant

## Message History Formatting
```typescript
const chatHistory = requestMessages.slice(0, -1).map((msg: any) => ({
  role: msg.type === 'user' ? 'user' : 'model',
  parts: [{ text: msg.content }],
}))

const latestMessage = requestMessages[requestMessages.length - 1]
```
- `slice(0, -1)` - gets all messages except the last one for history
- Maps internal message format to Gemini's expected format
- Converts `type` field to `role` field
- Wraps content in `parts` array as required by Gemini API
- Separates latest message for processing

## Chat Initialization with History
```typescript
const chat = model.startChat({
  history: [
    {
      role: 'user',
      parts: [{ text: systemPrompt }],
    },
    {
      role: 'model',
      parts: [{ text: 'I understand. I\'m TrustLens AI, ready to help...' }],
    },
    ...chatHistory,
  ],
})
```
- Starts chat session with conversation history
- Begins with system prompt to set AI behavior
- AI acknowledges understanding of its role
- Spreads (`...`) previous conversation history
- Maintains context across multiple messages

## AI Response with Retry Logic
```typescript
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
```
- Attempts to send message to AI
- Catches rate limit errors (HTTP 429 or quota exceeded)
- Waits 1 second before retry: `setTimeout(resolve, 1000)`
- Creates simpler chat without full history to reduce token usage
- Re-throws other errors to main catch block

## Success Response Processing
```typescript
const response = await result.response
const aiResponse = response.text()

return NextResponse.json({
  success: true,
  message: aiResponse,
  model: 'gemini-1.5-flash',
  timestamp: new Date().toISOString(),
})
```
- Extracts response from AI result
- Gets text content from response
- Returns successful JSON response with metadata
- Includes timestamp for debugging/logging

## Main Error Handling
```typescript
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
```
- Catches any unhandled errors from the main try block
- Logs error for debugging
- Safely extracts user message from previously stored request data
- Uses nested try-catch to handle potential parsing errors

## Error-Specific Fallback Responses
```typescript
const errorMessage = error instanceof Error ? error.message : 'Unknown error'
let fallbackMessage = ''

if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
  fallbackMessage = "I'm experiencing high demand right now and have hit API rate limits. Let me help you with some basic shopping guidance instead! " + getFallbackResponse(userMessageContent)
} else {
  fallbackMessage = getFallbackResponse(userMessageContent)
}
```
- Safely extracts error message
- Checks for specific rate limit errors
- Provides user-friendly explanation for rate limits
- Falls back to general response for other errors

## Error Response
```typescript
return NextResponse.json({
  success: true,
  message: fallbackMessage,
  fallback: true,
  model: 'gemini-fallback',
  error: errorMessage,
})
```
- Returns success:true even for errors (graceful degradation)
- Includes fallback flag to indicate AI wasn't used
- Provides error details for debugging

## GET Request Handler
```typescript
export async function GET() {
  return NextResponse.json({
    status: 'TrustLens AI Chat API is running',
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-pro',
    provider: 'Google Gemini',
  })
}
```
- Handles GET requests for API status checking
- Returns basic information about the API
- Useful for health checks and debugging

## Key Features:
1. **Graceful Degradation** - Always provides responses even when AI fails
2. **Rate Limit Handling** - Implements retry logic and simpler requests
3. **Fallback System** - Pattern-based responses when AI unavailable
4. **Context Preservation** - Maintains conversation history
5. **Error Recovery** - Multiple layers of error handling
6. **User Experience** - Always responds helpfully regardless of technical issues

This API ensures users always get assistance with their shopping needs, whether through AI or intelligent fallbacks.