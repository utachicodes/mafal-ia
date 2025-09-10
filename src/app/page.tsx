import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Bot, Shield, Zap, MessageSquare, Globe, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary animate-in fade-in duration-700" />
            <span className="text-2xl font-semibold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Mafal-IA</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="button-hover">
              <Link href="/auth/signin">Login</Link>
            </Button>
            <Button asChild className="button-hover">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* subtle animated gradient blob */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-2xl animate-in fade-in zoom-in duration-1000" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-2xl animate-in fade-in zoom-in duration-1000 delay-200" />
        </div>
        <div className="container mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-4 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="h-3.5 w-3.5" /> B2B WhatsApp Chatbots for Restaurants
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-2">
            Noo ngi fi pour jàppal — Your Restaurant’s WhatsApp AI
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            Onboard, connect your WhatsApp Business number, and let Mafal-IA answer questions, recommend dishes, and take orders — menu-aware, multilingual, and tenant-isolated.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg button-hover">
              <Link href="/onboarding">Create Your Restaurant</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-2 button-hover">
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">Built for scale, designed for clarity</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: 'Menu-aware AI', desc: 'Understands your dishes, prices, and availability with RAG per restaurant.' },
              { icon: Globe, title: 'Multilingual', desc: 'French, English, Wolof, Arabic — auto-detected with polite tone.' },
              { icon: MessageSquare, title: 'WhatsApp-native', desc: 'Webhook verification, secure signatures, and quick replies.' },
              { icon: Zap, title: 'Fast & Reliable', desc: 'Node runtime, Prisma ORM, SQLite dev / Postgres prod.' },
            ].map((f, i) => (
              <div key={f.title} className="card rounded-xl border bg-card/50 p-6 backdrop-blur animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${150 * i}ms` } as any}>
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-neutral-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Three steps to go live</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Create Restaurant', desc: 'Add your profile and plan, then paste/import your menu JSON.' },
              { n: '2', title: 'Connect WhatsApp', desc: 'Set phone_number_id and access token. We verify the webhook for you.' },
              { n: '3', title: 'Launch & Monitor', desc: 'Test chats in the playground and track orders and analytics in the dashboard.' },
            ].map((s, i) => (
              <div key={s.n} className="rounded-xl border bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-primary text-sm font-semibold mb-2">Step {s.n}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-neutral-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h3 className="text-3xl font-semibold mb-4">Ready for your launch?</h3>
          <p className="text-neutral-600 mb-8">We built Mafal-IA to be production-grade for B2B restaurants. Your customers get instant, accurate answers and smooth ordering on WhatsApp.</p>
          <Button asChild size="lg" className="button-hover">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-neutral-950 text-neutral-400">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Mafal-IA</span>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} Mafal-IA. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
