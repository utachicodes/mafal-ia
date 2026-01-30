"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/src/components/logo";
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle";
import { LanguageSwitcher } from "@/src/components/language-switcher";
import { useLanguage, translations } from "@/src/lib/i18n";
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
  Store
} from "lucide-react";
import { useEffect } from "react";

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
  const { language } = useLanguage();
  const t = translations[language];

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

  const trustLogos = [
    { icon: <ShoppingCart className="h-8 w-8" />, label: t.trust.restaurant },
    { icon: <Package className="h-8 w-8" />, label: t.trust.shop },
    { icon: <Bot className="h-8 w-8" />, label: t.trust.cafe },
    { icon: <Store className="h-8 w-8" />, label: t.trust.bakery },
    { icon: <TrendingUp className="h-8 w-8" />, label: t.trust.groceryStore },
    { icon: <Zap className="h-8 w-8" />, label: t.trust.fastFood },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-10" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                {t.nav.features}
              </a>
              <a href="#how" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                {t.nav.howItWorks}
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                {t.nav.testimonials}
              </a>
              <LanguageSwitcher />
              <SimpleThemeToggle />
              <Link href="/onboarding">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-6 shadow-md hover:shadow-lg transition-all">
                  {t.nav.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-b from-red-50/30 dark:from-red-950/10 to-white dark:to-gray-950">
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
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t.hero.headline}{" "}
                  <span className="text-red-500">{t.hero.headlineHighlight}</span>{" "}
                  {t.hero.headlineEnd}
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {t.hero.description}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="#contact">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t.hero.cta}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-8 py-6 text-lg font-semibold transition-all"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-4">
                {t.hero.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-red-500">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[600px] flex items-center justify-center">
                <Image
                  src="/brain/9d162907-a90e-4ddb-a59d-16b4495d8349/whatsapp_mockup_hero_1769711297049.png"
                  alt="WhatsApp automation interface"
                  width={400}
                  height={600}
                  className="object-contain drop-shadow-2xl"
                />
                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 -left-10 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">+40% {language === 'fr' ? 'ventes' : language === 'ar' ? 'مبيعات' : 'sales'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'fr' ? 'Ce mois' : language === 'ar' ? 'هذا الشهر' : 'This month'}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                  className="absolute bottom-10 -right-10 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{language === 'fr' ? 'IA Active' : language === 'ar' ? 'الذكاء الاصطناعي نشط' : 'AI Active'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">24/7</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-12"
          >
            {t.trust.title}
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center"
          >
            {trustLogos.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-red-500 dark:text-red-400">
                  {item.icon}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.value.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
                <Card className="p-6 h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
                <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-900/50 transition-all duration-300 h-full">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-4 mb-4 text-red-500 dark:text-red-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
                <Card className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Users className="h-7 w-7 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed mb-6">
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

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  {t.cta.ctaPrimary}
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold transition-all"
              >
                {t.cta.ctaSecondary}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 dark:bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="h-10 mb-4 brightness-0 invert" />
              <p className="text-sm text-gray-400">
                {t.footer.tagline}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t.footer.features}</a></li>
                <li><a href="#how" className="hover:text-white transition-colors">{t.footer.howItWorks}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.blog}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.contact}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
