"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, RefreshCw, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import type { Restaurant, ChatMessage } from "@/lib/data"
import { AIClient } from "@/src/lib/ai-client"

interface ChatbotLiveViewProps {
  restaurant: Restaurant
}

interface ExtendedChatMessage extends ChatMessage {
  detectedLanguage?: string
  usedTools?: string[]
  error?: string
}

export function ChatbotLiveView({ restaurant }: ChatbotLiveViewProps) {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm the AI assistant for ${restaurant.name}. How can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ExtendedChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError(null)

    try {
      const contextText = [
        restaurant.chatbotContext?.welcomeMessage,
        `Hours: ${restaurant.chatbotContext?.businessHours}`,
        restaurant.chatbotContext?.specialInstructions,
        `Delivery: ${restaurant.chatbotContext?.deliveryInfo}`,
      ]
        .filter(Boolean)
        .join("\n")

      const aiResponse = await AIClient.generateResponse(
        [...messages, userMessage],
        contextText,
        restaurant.menu,
        restaurant.name,
      )

      const assistantMessage: ExtendedChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: aiResponse.response,
        timestamp: new Date(),
        detectedLanguage: aiResponse.detectedLanguage,
        usedTools: aiResponse.usedTools,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)

      const errorMessage: ExtendedChatMessage = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I'm experiencing technical difficulties right now. Please try again in a moment.",
        timestamp: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      }

      setMessages((prev) => [...prev, errorMessage])
      setError("Failed to generate response. Please check your AI configuration.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm the AI assistant for ${restaurant.name}. How can I help you today?`,
        timestamp: new Date(),
      },
    ])
    setError(null)
  }

  const handleTestScenario = (scenario: string) => {
    setInputMessage(scenario)
  }

  const testScenarios = [
    "What's on your menu?",
    "Do you have vegetarian options?",
    "I'd like to order 2 Thieboudienne and 1 Yassa Poulet",
    "What are your opening hours?",
    "Qu'est-ce que vous avez comme plats du jour?", // French
    "How much does the Mafe cost?",
  ]

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Test Scenarios</CardTitle>
          <CardDescription>Click on any scenario to test your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {testScenarios.map((scenario, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleTestScenario(scenario)}
                disabled={isLoading}
              >
                {scenario}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Chat Preview</CardTitle>
              <CardDescription>
                Test your chatbot with real AI responses. This simulates how customers will interact with your WhatsApp
                bot.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearChat} disabled={isLoading}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.error ? "bg-destructive" : "bg-primary"
                        }`}
                      >
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-2">
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.error
                            ? "bg-destructive/10 border border-destructive/20"
                            : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                        {message.role === "assistant" && !message.error && (
                          <CheckCircle className="w-3 h-3 opacity-70" />
                        )}
                      </div>
                    </div>

                    {message.role === "assistant" &&
                      (message.detectedLanguage || message.usedTools || message.error) && (
                        <div className="flex flex-wrap gap-1">
                          {message.detectedLanguage && (
                            <Badge variant="secondary" className="text-xs">
                              Language: {message.detectedLanguage}
                            </Badge>
                          )}
                          {message.usedTools && message.usedTools.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Tools: {message.usedTools.join(", ")}
                            </Badge>
                          )}
                          {message.error && (
                            <Badge variant="destructive" className="text-xs">
                              Error: {message.error}
                            </Badge>
                          )}
                        </div>
                      )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Chat Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chat Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{messages.length}</div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{messages.filter((m) => m.role === "user").length}</div>
              <div className="text-sm text-muted-foreground">User Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {messages.filter((m) => m.usedTools && m.usedTools.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Tool Uses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{messages.filter((m) => m.error).length}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
