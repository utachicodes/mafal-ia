"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Globe, Zap, CheckCircle2, Shield, Phone, Layers, Rocket } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/src/components/logo"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 relative overflow-hidden">
      {/* Animated background blobs (non-placeholder, pure CSS) */}
      <div className="blob-base blob-float blob-pulse top-[-8rem] right-[-8rem] h-[22rem] w-[22rem] bg-primary/20" />
      <div className="blob-base blob-float-slow top-[20%] left-[-6rem] h-[18rem] w-[18rem] bg-emerald-500/15" />
      <div className="blob-base blob-float bottom-[-10rem] right-[10%] h-[20rem] w-[20rem] bg-fuchsia-500/10" />
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-8" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
          <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#whatsapp" className="text-muted-foreground hover:text-foreground">WhatsApp</a>
          <Link href="/onboarding"><Button size="sm">Get started</Button></Link>
        </div>
      </nav>

      <header className="container mx-auto px-4 pt-10 pb-16 text-center animate-in fade-in-50">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-3 animate-in fade-in-50">
          <CheckCircle2 className="h-3 w-3" /> Multi‑restaurant WhatsApp agents in minutes
        </div>
        <div className="text-sm md:text-base text-primary/80 font-medium mb-2 animate-in slide-in-from-bottom-2">
          Noo ngi fi pour jàppal
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Build WhatsApp agents for your restaurants
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Paste your menu, add your WhatsApp credentials, verify the webhook, and go live. AI answers in French, English, Wolof, or Arabic.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in zoom-in-50">
          <Link href="/onboarding"><Button size="lg" className="px-8 hover:scale-[1.02] transition-transform">Create an agent</Button></Link>
          <Link href="/playground"><Button size="lg" variant="outline" className="px-8 hover:scale-[1.02] transition-transform">Try the playground</Button></Link>
        </div>
      </header>

      <section id="features" className="container mx-auto px-4 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl border-border/50 bg-card/60 backdrop-blur transition-transform duration-300 hover:scale-[1.02] animate-in fade-in-50">
            <CardHeader className="space-y-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-base">Menu‑aware AI</CardTitle>
              <CardDescription>Understands intent and your menu to answer and take orders.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl border-border/50 bg-card/60 backdrop-blur transition-transform duration-300 hover:scale-[1.02] animate-in fade-in-50 delay-100">
            <CardHeader className="space-y-2">
              <Globe className="h-6 w-6 text-primary" />
              <CardTitle className="text-base">Multilingual</CardTitle>
              <CardDescription>French, English, Wolof, Arabic auto‑detected.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl border-border/50 bg-card/60 backdrop-blur transition-transform duration-300 hover:scale-[1.02] animate-in fade-in-50 delay-150">
            <CardHeader className="space-y-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle className="text-base">WhatsApp‑native</CardTitle>
              <CardDescription>Works with your WhatsApp Business API and phone_number_id.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl border-border/50 bg-card/60 backdrop-blur transition-transform duration-300 hover:scale-[1.02] animate-in fade-in-50 delay-200">
            <CardHeader className="space-y-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle className="text-base">Fast setup</CardTitle>
              <CardDescription>Go from menu to live agent in under 15 minutes.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="how" className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
          <p className="text-muted-foreground">Five quick steps to your WhatsApp agent</p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          <Card><CardHeader><CardTitle className="text-base">1. Restaurant</CardTitle><CardDescription>Add name, description, hours.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">2. Menu</CardTitle><CardDescription>Paste JSON, CSV, or text; we auto‑structure it.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">3. WhatsApp</CardTitle><CardDescription>Enter phone_number_id, Access Token, App Secret, Verify Token.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">4. Verify</CardTitle><CardDescription>Meta webhook GET + signed POST.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-base">5. Go live</CardTitle><CardDescription>Start taking orders via WhatsApp.</CardDescription></CardHeader></Card>
        </div>
      </section>

      <section id="whatsapp" className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <Card className="h-full"><CardHeader>
            <div className="flex items-center gap-2 mb-1"><Phone className="h-5 w-5 text-primary" /><CardTitle className="text-xl">WhatsApp integration</CardTitle></div>
            <CardDescription>Multi‑tenant by design. Each restaurant stores its own credentials.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><span>Per‑restaurant App Secret for signature validation</span></div>
            <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Per‑restaurant Access Token override</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span>Per‑restaurant Verify Token for webhook setup</span></div>
          </CardContent></Card>
          <Card className="h-full"><CardHeader>
            <div className="flex items-center gap-2 mb-1"><Rocket className="h-5 w-5 text-primary" /><CardTitle className="text-xl">Why Mafal‑IA</CardTitle></div>
            <CardDescription>Purpose‑built for restaurants in Senegal and beyond.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>• Menu‑aware answers and order totals</div>
            <div>• Delivery zones and ETA hints</div>
            <div>• Concierge mode across multiple brands</div>
          </CardContent></Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-3xl mx-auto animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to launch your WhatsApp agent?</CardTitle>
            <CardDescription>Create your first restaurant and go live today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onboarding"><Button size="lg" className="px-8 hover:scale-[1.02] transition-transform">Get started</Button></Link>
              <Link href="/settings"><Button size="lg" variant="outline" className="px-8 hover:scale-[1.02] transition-transform">View docs</Button></Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
