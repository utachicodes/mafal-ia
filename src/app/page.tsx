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
      {/* How it works */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">{t('steps.heading')}</h2>
            <p className="text-lg text-muted-foreground">Start automating your restaurant in just 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '1', title: t('steps.s1.title'), desc: t('steps.s1.desc'), icon: MessageSquare },
              { n: '2', title: t('steps.s2.title'), desc: t('steps.s2.desc'), icon: Bot },
              { n: '3', title: t('steps.s3.title'), desc: t('steps.s3.desc'), icon: Zap },
            ].map((s, i) => (
              <div key={s.n} className="relative group">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/5 rounded-3xl transform rotate-3 scale-95 group-hover:rotate-0 group-hover:scale-100 transition-all duration-300" />
                <div className="glass-card relative rounded-3xl p-8 h-full border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="text-6xl font-black text-muted/20 select-none">{s.n}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
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
