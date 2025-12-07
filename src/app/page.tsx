"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bot, Zap, MessageSquare, Globe, CheckCircle, ArrowRight } from 'lucide-react'
import { SimpleThemeToggle } from '@/src/components/simple-theme-toggle'
import { Logo } from '@/src/components/logo'
import { useI18n } from '@/src/context/i18n'

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen">
      {/* Header (Glass) */}
      <header className="sticky top-0 z-50 glass border-b-0 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="h-8" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SimpleThemeToggle />
            <div className="hidden md:flex gap-2">
              <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Link href="/dashboard">{t('header.login')}</Link>
              </Button>
              <Button asChild className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40">
                <Link href="/dashboard">{t('header.dashboard')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-float opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-float opacity-60" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="container mx-auto max-w-6xl px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CheckCircle className="h-4 w-4" /> {t('hero.badge')}
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {t('hero.title')}<span className="text-primary">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
              <Link href="/onboarding">
                {t('hero.ctaPrimary')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all">
              <Link href="#features">{t('hero.ctaSecondary')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('features.heading')}</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: t('features.menu'), desc: t('features.menuDesc'), color: "text-blue-500" },
              { icon: Globe, title: t('features.multi'), desc: t('features.multiDesc'), color: "text-green-500" },
              { icon: MessageSquare, title: t('features.wa'), desc: t('features.waDesc'), color: "text-indigo-500" },
              { icon: Zap, title: t('features.fast'), desc: t('features.fastDesc'), color: "text-amber-500" },
            ].map((f, i) => (
              <div key={f.title} className="glass-card rounded-2xl p-8 card-hover" style={{ animationDelay: `${100 * i}ms` }}>
                <div className={`h-12 w-12 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center mb-6 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t('steps.heading')}</h2>
              <p className="text-lg text-muted-foreground mb-8">Get up and running in minutes, not days.</p>
              <div className="space-y-8">
                {[
                  { n: '1', title: t('steps.s1.title'), desc: t('steps.s1.desc') },
                  { n: '2', title: t('steps.s2.title'), desc: t('steps.s2.desc') },
                  { n: '3', title: t('steps.s3.title'), desc: t('steps.s3.desc') },
                ].map((s, i) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                      <p className="text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Abstract graphic representing the app interface */}
              <div className="glass-card rounded-2xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-20 w-3/4 bg-primary/10 rounded-lg rounded-tl-none" />
                  <div className="h-8 w-1/2 bg-muted rounded-lg self-end ml-auto" />
                  <div className="h-8 w-1/3 bg-muted rounded-lg self-end ml-auto" />
                  <div className="h-24 w-5/6 bg-primary/5 rounded-lg border border-primary/10 p-4">
                    <div className="h-2 w-1/3 bg-primary/20 rounded mb-2" />
                    <div className="h-2 w-full bg-primary/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary text-primary-foreground transform -skew-y-3 scale-110 -z-10 origin-center" />
        <div className="container mx-auto px-6 text-center max-w-3xl relative z-10 text-white">
          <h3 className="text-4xl font-bold mb-6 tracking-tight">{t('cta.heading')}</h3>
          <p className="text-primary-foreground/80 text-xl mb-10">{t('cta.desc')}</p>
          <Button asChild size="lg" variant="secondary" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform text-primary font-bold">
            <Link href="/onboarding">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="opacity-80 grayscale hover:grayscale-0 transition-all">
            <Logo className="h-6" />
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('app.name')} Inc.
          </div>
        </div>
      </footer>
    </div>
  )
}
