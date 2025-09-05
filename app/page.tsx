"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Globe, Zap } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/src/components/logo"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-8" />
          <span className="text-xl font-semibold text-primary"></span>
        </div>
        <div>
          <Link href="/dashboard">
            <Button variant="ghost"></Button>
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center pt-8 mb-16">

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



        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur transition-transform duration-300 hover:scale-105">
            <CardHeader className="space-y-1">
              <Bot className="h-7 w-7 text-primary" />
              <CardDescription>AI that understands intent and context</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur transition-transform duration-300 hover:scale-105">
            <CardHeader className="space-y-1">
              <Globe className="h-7 w-7 text-primary" />
              <CardDescription>French, English, Wolof, Arabic auto-detected</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur transition-transform duration-300 hover:scale-105">
            <CardHeader className="space-y-1">
              <MessageSquare className="h-7 w-7 text-primary" />
              <CardDescription>WhatsApp Business API native</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur transition-transform duration-300 hover:scale-105">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
