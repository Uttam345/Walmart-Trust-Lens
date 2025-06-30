"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"

export function AIChat() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hi! I'm your AI shopping assistant. I can help you find products, compare prices, read reviews, and make smart purchasing decisions. What are you looking for today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const newMessages = [
      ...messages,
      { type: "user", content: input },
      {
        type: "bot",
        content: "I'd be happy to help you with that! Let me search for the best options and reviews for you.",
      },
    ]

    setMessages(newMessages)
    setInput("")
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-blue-600" : "bg-gray-200"}`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about products..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
