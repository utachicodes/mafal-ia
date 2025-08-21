"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Bot, Globe, Zap } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/src/components/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-4 inline-block h-8 text-foreground"><Logo className="h-8" /></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mafal-IA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            <span className="font-semibold text-foreground">Noo ngi fi pour jàppal.</span> Create intelligent, multilingual WhatsApp chatbots for your restaurant in minutes
          </p>
          <Link href="/restaurants">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
              <MessageSquare className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Onboarding Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Create Your Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add your restaurant profile: name, description, and choose a plan that fits your needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Upload Your Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your menu as a JSON file. We automatically parse items, descriptions, and prices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Get Your API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Use your unique API key to connect your WhatsApp Business account. Your chatbot is ready!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent chatbots that understand customer queries and provide accurate responses
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multilingual</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automatically detects and responds in the customer's preferred language</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>WhatsApp Native</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamlessly integrates with WhatsApp Business API for direct customer communication
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configure your restaurant chatbot in minutes with our intuitive dashboard
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to transform your restaurant?</CardTitle>
              <CardDescription className="text-lg">
                Join restaurants across Senegal using Mafal-IA to enhance customer experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/restaurants">
                <Button size="lg" className="w-full md:w-auto">
                  Create Your First Chatbot
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
