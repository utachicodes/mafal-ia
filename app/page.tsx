"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Globe, Zap } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/src/components/logo"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-5 inline-block h-8 text-foreground"><Logo className="h-8" /></div>
          <h1 className="text-4xl md:text-6xl font-semibold mb-3 text-primary">Noo ngi fi pour jàppal</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your Intelligent WhatsApp Assistant. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Getting Started Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="rounded-xl border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Get Started Now</CardTitle>
              <CardDescription>Access all features instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Access the dashboard</h3>
                    <p className="text-sm text-muted-foreground">Start in seconds</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Configure your restaurant</h3>
                    <p className="text-sm text-muted-foreground">Add your menu and information</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Connect WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Integrate AI with your business number</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full">Access Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1">
              <Bot className="h-7 w-7 text-primary" />
              <CardDescription>AI that understands intent and context</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1">
              <Globe className="h-7 w-7 text-primary" />
              <CardDescription>French, English, Wolof, Arabic auto-detected</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1">
              <MessageSquare className="h-7 w-7 text-primary" />
              <CardDescription>WhatsApp Business API native</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1">
              <Zap className="h-7 w-7 text-primary" />
              <CardDescription>Setup in minutes, not weeks</CardDescription>
            </CardHeader>
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
              <Link href="/dashboard">
                <Button size="lg" className="w-full md:w-auto">
                  Access Dashboard Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
