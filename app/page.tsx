"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Bot, Globe, Zap, Key, Upload, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/src/components/logo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export default function HomePage() {
  const router = useRouter()
  const [profil, setProfil] = useState("")
  const [source, setSource] = useState("")
  const [langue, setLangue] = useState("French")
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<string>("light")

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("homepage_profile")
        if (raw) {
          const parsed = JSON.parse(raw || "{}")
          if (parsed.profil) setProfil(parsed.profil)
          if (parsed.source) setSource(parsed.source)
          if (parsed.langue) setLangue(parsed.langue)
          if (parsed.theme) {
            setSelectedTheme(parsed.theme)
            setTheme(parsed.theme)
          }
        }
        // If nothing stored, sync selector with current theme
        if (!raw && theme) setSelectedTheme(theme)
      }
    } catch {}
  }, [theme, setTheme])

  function saveProfile() {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "homepage_profile",
          JSON.stringify({ profil, source, langue, theme: selectedTheme })
        )
      }
    } catch {}
    // Go to dashboard after saving profile
    router.push("/dashboard")
  }
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
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
              <MessageSquare className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Profil Setup */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Configurez les préférences de votre assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profil">Profil</Label>
                  <Input id="profil" value={profil} onChange={(e) => setProfil(e.target.value)} placeholder="Nom du profil" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ex: Boutique, Web, WhatsApp" />
                </div>

                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={langue} onValueChange={setLangue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="French">Français</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Wolof">Wolof</SelectItem>
                      <SelectItem value="Arabic">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select
                    value={selectedTheme}
                    onValueChange={(v) => {
                      setSelectedTheme(v)
                      setTheme(v as any)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={saveProfile}>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Steps */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <Key className="h-6 w-6 text-primary mb-2" />
                <CardTitle>1. Create Your Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start by adding your profile. Fill in the name, description, and choose a plan that fits your needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <Upload className="h-6 w-6 text-primary mb-2" />
                <CardTitle>2. Upload Your Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your menu as a JSON file. The system parses items, descriptions, and prices automatically.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <Check className="h-6 w-6 text-primary mb-2" />
                <CardTitle>3. Get Your API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Grab your API key and connect your WhatsApp Business account. Your intelligent assistant is ready.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
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
