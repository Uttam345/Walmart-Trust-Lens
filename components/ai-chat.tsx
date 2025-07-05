"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Send, Bot, User, Loader2, AlertCircle, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, ShoppingCart, Package, Menu, Settings, Share2, Trash2, TreePine } from "lucide-react"

interface Message {
  type: "user" | "bot"
  content: string
  timestamp?: Date
  error?: boolean
  id?: string
}

interface ChatContext {
  scannedProducts?: any[]
  userPreferences?: any
  currentLocation?: string
}

export function AIChat({ context }: { context?: ChatContext }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: "👋 Welcome to Walmart SmartScan Pro! I'm your AI shopping assistant. I can help you find products, compare prices, get recommendations, and make informed purchasing decisions. What are you looking for today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully",
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast({
        title: "Copy failed",
        description: "Unable to copy message to clipboard",
        variant: "destructive",
      })
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content: "👋 Welcome to Walmart SmartScan Pro! I'm your AI shopping assistant. I can help you find products, compare prices, get recommendations, and make informed purchasing decisions. What are you looking for today?",
        timestamp: new Date()
      }
    ])
    toast({
      title: "Chat cleared",
      description: "All messages have been deleted",
    })
  }

  const shareChat = async () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to share",
        description: "Start a conversation first",
        variant: "destructive",
      })
      return
    }

    const chatText = messages
      .map(m => `${m.type === 'user' ? 'You' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    try {
      await navigator.clipboard.writeText(chatText)
      toast({
        title: "Chat copied",
        description: "Conversation copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Share failed",
        description: "Unable to copy conversation",
        variant: "destructive",
      })
    }
  }

  const regenerateResponse = async (messageIndex: number) => {
    const messagesUpToRegenerate = messages.slice(0, messageIndex)
    const lastUserMessage = messagesUpToRegenerate.filter(m => m.type === "user").pop()
    
    if (!lastUserMessage) return

    setMessages(messagesUpToRegenerate)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesUpToRegenerate,
          context: context || {},
        }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: `msg-${Date.now()}`,
          type: "bot",
          content: data.message,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Regenerate error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: context || {},
        }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          type: "bot",
          content: data.message,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])
        
        // Show a subtle indicator if this was a fallback response
        if (data.fallback) {
          toast({
            title: "Using fallback mode",
            description: "AI services are limited, but I can still help with basic shopping questions!",
          })
        }
      } else {
        // Error handling
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          type: "bot",
          content: data.message || "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
          error: true,
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: "bot",
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
        error: true,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const MessageContent = ({ message, index }: { message: Message, index: number }) => {
    const isUser = message.type === "user"
    const isError = message.error
    
    return (
      <div className={`group relative w-full ${isUser ? "bg-transparent" : "bg-gray-50/30"} hover:bg-gray-50/50 transition-colors`}>
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex gap-3 md:gap-4">
            {/* Avatar */}
            <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white ${
              isUser 
                ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                : isError 
                  ? "bg-gradient-to-br from-red-500 to-red-600" 
                  : "bg-gradient-to-br from-purple-500 to-blue-600"
            }`}>
              {isUser ? (
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
              ) : isError ? (
                <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">
                  {isUser ? "You" : "Assistant"}
                </span>
                {message.timestamp && (
                  <span className="text-xs text-gray-500 hidden md:inline">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              
              <div className={`text-sm md:text-base leading-relaxed ${
                isError ? "text-red-800" : "text-gray-800"
              }`}>
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              </div>

              {/* Message Actions - Only for bot messages */}
              {!isUser && !isError && (
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content)}
                    className="h-7 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => regenerateResponse(index + 1)}
                    className="h-7 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    title="Regenerate response"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    title="Good response"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    title="Bad response"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm md:text-base">AI Shopping Assistant</h2>
            <p className="text-xs text-gray-500 hidden md:block">Powered by Claude 3.5 Sonnet</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            onClick={shareChat}
            title="Share conversation"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Welcome to AI Shopping Assistant</h3>
            <p className="text-gray-600 max-w-md mb-8">
              I'm here to help you make smarter purchasing decisions, find the best deals, and discover products that match your needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 text-left"
                onClick={() => setInput("Find me the best deals on electronics")}
              >
                <Package className="w-4 h-4 mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Find Products</div>
                  <div className="text-xs text-gray-500">Search for items you need</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 text-left"
                onClick={() => setInput("Compare prices for iPhone 15")}
              >
                <ShoppingCart className="w-4 h-4 mr-3 text-green-600" />
                <div>
                  <div className="font-medium">Compare Prices</div>
                  <div className="text-xs text-gray-500">Get the best deals</div>
                </div>
              </Button>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <MessageContent key={message.id || index} message={message} index={index} />
        ))}
        
        {/* Loading Message */}
        {isLoading && (
          <div className="w-full bg-gray-50/30">
            <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
              <div className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions - Show for welcome message */}
          {!isLoading && messages.length <= 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs whitespace-nowrap h-8 px-3"
                onClick={() => setInput("What are the best smartphone deals right now?")}
              >
                <Package className="w-3 h-3 mr-1" />
                Best Deals
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs whitespace-nowrap h-8 px-3"
                onClick={() => setInput("Compare iPhone vs Samsung Galaxy")}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Compare Products
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs whitespace-nowrap h-8 px-3"
                onClick={() => setInput("I need a laptop under $500")}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Find Budget Options
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs whitespace-nowrap h-8 px-3"
                onClick={() => setInput("Help me find sustainable products")}
              >
                <TreePine className="w-3 h-3 mr-1" />
                Eco-Friendly
              </Button>
            </div>
          )}
          
          {/* Input Field */}
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Assistant..."
              onKeyPress={handleKeyPress}
              className="pr-12 py-3 text-base border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              disabled={isLoading}
            />
            
            {/* Send Button */}
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Footer Text */}
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI can make mistakes. Check important info and verify product details.
          </p>
        </div>
      </div>
    </div>
  )
}
