"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/src/components/logo";
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle";
import { LanguageSwitcher } from "@/src/components/language-switcher";
import { useLanguage, translations } from "@/src/lib/i18n";
import { useSession, signOut } from "next-auth/react";
import {
  Bot,
  Zap,
  Globe,
  Clock,
  TrendingUp,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Bell,
  Smartphone,
  DollarSign,
  Users,
  Package,
  Target,
  CheckCircle2,
  Star,
  Store,
} from "lucide-react";
import { WhatsAppMockup } from "@/src/components/whatsapp-mockup";
import { useEffect } from "react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export default function HomeClient() {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const t = translations[language];

  const partnerLogos: Array<{ name: string; src?: string }> = [
    { name: "Wave", src: "/partners/wave.jpeg" },
    { name: "Orange Money", src: "/partners/orangemoney.jpeg" },
    { name: "Djamo", src: "/partners/djamo.jpeg" },
    { name: "L'Africa Mobile", src: "/partners/lam.jpeg" },
    { name: "Yango", src: "/partners/yango.jpeg" },
    { name: "Paps", src: "/partners/paps.jpeg" },
    { name: "Flowbot", src: "/partners/flowbot.jpeg" },
    { name: "Mixx", src: "/partners/mixx.jpeg" },
  ];

  const partnerLogos2: Array<{ name: string; src?: string }> = [
    { name: "Samirpay", src: "/partners/samirpay.jpeg" },
    { name: "Senhub", src: "/partners/senhub.jpeg" },
    { name: "JobTech", src: "/partners/jobtech.jpeg" },
    { name: "OST", src: "/partners/ost.jpeg" },
    { name: "HTC", src: "/partners/htc.jpeg" },
    { name: "YAS", src: "/partners/yas.jpeg" },
    { name: "Bug", src: "/partners/bug.jpeg" },
  ];

  const OrbitLogo = ({ name, src }: { name: string; src?: string }) => {
    if (!src) {
      return (
        <span className="text-[11px] font-semibold text-[#062b2a] tracking-tight">
          {name}
        </span>
      );
    }

    return (
      <Image
        src={src}
        alt={name}
        width={84}
        height={28}
        className="h-6 w-auto object-contain"
      />
    );
  };

  const PartnerLogo = ({ name, src }: { name: string; src?: string }) => {
    if (!src) {
      return <span className="text-xs font-semibold text-muted-foreground">{name}</span>;
    }

    return (
      <Image
        src={src}
        alt={name}
        width={120}
        height={40}
        className="h-8 w-auto object-contain opacity-90 dark:opacity-70"
      />
    );
  };

  // Update HTML dir attribute for RTL support
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: t.features.autoSales,
      desc: t.features.autoSalesDesc
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t.features.multilingual,
      desc: t.features.multilingualDesc
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: t.features.catalog,
      desc: t.features.catalogDesc
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: t.features.orders,
      desc: t.features.ordersDesc
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: t.features.notifications,
      desc: t.features.notificationsDesc
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t.features.analytics,
      desc: t.features.analyticsDesc
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t.features.support,
      desc: t.features.supportDesc
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t.features.whatsapp,
      desc: t.features.whatsappDesc
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: t.features.payments,
      desc: t.features.paymentsDesc
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t.features.mobile,
      desc: t.features.mobileDesc
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t.features.crm,
      desc: t.features.crmDesc
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: t.features.marketing,
      desc: t.features.marketingDesc
    },
  ];

  // Stats are now in t.hero.stats array directly

  const testimonials = [
    {
      name: t.testimonials.testimonial1.name,
      business: t.testimonials.testimonial1.business,
      quote: t.testimonials.testimonial1.quote,
    },
    {
      name: t.testimonials.testimonial2.name,
      business: t.testimonials.testimonial2.business,
      quote: t.testimonials.testimonial2.quote,
    },
    {
      name: t.testimonials.testimonial3.name,
      business: t.testimonials.testimonial3.business,
      quote: t.testimonials.testimonial3.quote,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-10" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t.nav.features}
              </a>
              <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t.nav.howItWorks}
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t.nav.testimonials}
              </a>
              <LanguageSwitcher />
              <SimpleThemeToggle />

              {session ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">

                  <Link href="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-md hover:shadow-lg transition-all">
                      {t.nav.cta}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                  {t.hero.headline}{" "}
                  <span className="text-primary">{t.hero.headlineHighlight}</span>{" "}
                  {t.hero.headlineEnd}
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                {t.hero.description}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/onboarding">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t.hero.cta}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/20 px-8 py-6 text-lg font-semibold transition-all"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-4">
                {t.hero.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <WhatsAppMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos Carousel Section */}
      <section className="py-20 bg-muted/30 border-y border-border overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
              {t.trust.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {[
                t.trust.restaurant,
                t.trust.shop,
                t.trust.cafe,
                t.trust.bakery,
                t.trust.groceryStore,
                t.trust.fastFood,
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 1 — left to right */}
        <div className="marquee mb-4">
          <div className="marquee-track" style={{ gap: '1rem' }}>
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div
                key={`r1-${logo.name}-${i}`}
                className="flex h-14 w-36 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm px-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 flex-shrink-0"
              >
                <PartnerLogo name={logo.name} src={logo.src} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div className="marquee">
          <div className="marquee-track-reverse" style={{ gap: '1rem' }}>
            {[...partnerLogos2, ...partnerLogos2].map((logo, i) => (
              <div
                key={`r2-${logo.name}-${i}`}
                className="flex h-14 w-36 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm px-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 flex-shrink-0"
              >
                <PartnerLogo name={logo.name} src={logo.src} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.value.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.value.subtitle}
            </p>
          </motion.div>

          {/* Service Items */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {t.value.items.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.features.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.features.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.howItWorks.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.howItWorks.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                step: "1",
                title: t.howItWorks.step1Title,
                desc: t.howItWorks.step1Desc,
                icon: <Users className="h-8 w-8" />
              },
              {
                step: "2",
                title: t.howItWorks.step2Title,
                desc: t.howItWorks.step2Desc,
                icon: <Package className="h-8 w-8" />
              },
              {
                step: "3",
                title: t.howItWorks.step3Title,
                desc: t.howItWorks.step3Desc,
                icon: <Zap className="h-8 w-8" />
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <Card className="p-8 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-4 mb-4 text-primary dark:text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.testimonials.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <Card className="p-8 bg-card border border-border hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.pricingSection.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.pricingSection.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* Standard Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="p-8 bg-card border border-border shadow-xl h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t.pricingSection.cardTitle}</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-primary">{t.pricingSection.price}</span>
                    <span className="text-muted-foreground mb-2">{t.pricingSection.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.pricingSection.caption}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {t.pricingSection.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t.pricingSection.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="p-8 bg-card border-2 border-primary shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Popular
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t.pricingSection.premiumCardTitle}</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-primary">{t.pricingSection.premiumPrice}</span>
                    <span className="text-muted-foreground mb-2">{t.pricingSection.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.pricingSection.caption}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {t.pricingSection.premiumFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t.pricingSection.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground"
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <div className="relative grid gap-12 lg:grid-cols-2 items-center p-10 md:p-14 lg:p-16">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {t.cta.title}
                </h2>
                <p className="mt-5 text-base md:text-lg text-primary-foreground/80 leading-relaxed">
                  {t.cta.description}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/onboarding">
                    <Button
                      size="lg"
                      className="bg-background text-foreground hover:bg-accent px-8 py-6 text-base font-semibold shadow-lg"
                    >
                      {t.cta.ctaPrimary}
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold"
                  >
                    {t.cta.ctaSecondary}
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="relative aspect-square w-full">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="absolute inset-[10%] rounded-full border border-white/10" />
                  <div className="absolute inset-[22%] rounded-full border border-white/10" />

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                      <Logo className="h-10 w-auto" />
                    </div>
                  </div>

                  {[
                    { top: "6%", left: "50%", logo: partnerLogos[0] },
                    { top: "22%", left: "86%", logo: partnerLogos[1] },
                    { top: "54%", left: "92%", logo: partnerLogos[2] },
                    { top: "84%", left: "72%", logo: partnerLogos[3] },
                    { top: "90%", left: "36%", logo: partnerLogos[4] },
                    { top: "64%", left: "10%", logo: partnerLogos[5] },
                    { top: "30%", left: "12%", logo: partnerLogos[6] },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ top: item.top, left: item.left }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-white/10 shadow-sm px-2">
                        <OrbitLogo name={item.logo.name} src={item.logo.src} />
                      </div>
                    </div>
                  ))}

                  <div className="absolute -left-6 -top-6 h-36 w-36 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background text-foreground border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground">
                {t.footer.tagline}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">{t.footer.features}</a></li>
                <li><a href="#how" className="hover:text-foreground transition-colors">{t.footer.howItWorks}</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">{t.footer.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t.footer.blog}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t.footer.contact}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
