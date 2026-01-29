"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/src/components/logo";
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle";
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
  Award,
  CheckCircle2
} from "lucide-react";

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
      type: "spring",
      stiffness: 100
    }
  }
};

export default function HomeClient() {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Vente Automatique",
      desc: "IA intelligente qui présente vos produits et prend les commandes"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multilingue",
      desc: "Français, Anglais, Wolof, Arabe - parlez toutes les langues"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Catalogue Produits",
      desc: "Gérez facilement vos produits avec photos et prix"
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Gestion Commandes",
      desc: "Suivez et gérez toutes vos commandes en temps réel"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Notifications",
      desc: "Recevez instantanément chaque nouvelle commande"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics",
      desc: "Tableaux de bord détaillés sur vos ventes et performances"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Support 24/7",
      desc: "Votre IA travaille jour et nuit sans interruption"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Intégration WhatsApp",
      desc: "Connexion directe à votre compte WhatsApp Business"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Paiements Mobile",
      desc: "Acceptez Wave, Orange Money, Free Money"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "100% Mobile",
      desc: "Gérez tout depuis votre smartphone, où que vous soyez"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "CRM Client",
      desc: "Conservez l'historique et les préférences de vos clients"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Marketing",
      desc: "Envoyez des promotions ciblées à vos clients"
    },
  ];

  const stats = [
    { value: "98%", label: "Taux de satisfaction client" },
    { value: "3h", label: "Temps économisé par jour" },
    { value: "+45%", label: "Croissance moyenne des ventes" }
  ];

  const testimonials = [
    {
      name: "Aminata Diallo",
      business: "Restaurant Le Dakar",
      quote: "Depuis que j'utilise Mafal-IA, je ne perds plus aucune commande. Mes clients adorent commander sur WhatsApp !",
      avatar: "👩🏾‍🍳"
    },
    {
      name: "Moussa Sow",
      business: "Boutique Fatou",
      quote: "Mon chiffre d'affaires a augmenté de 50% en 2 mois. L'IA répond même quand je dors.",
      avatar: "👨🏿‍💼"
    },
    {
      name: "Khady Ndiaye",
      business: "Café Teranga",
      quote: "Configuration en 10 minutes, résultats immédiats. Exactement ce dont j'avais besoin !",
      avatar: "👩🏾‍💼"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-10" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                Fonctionnalités
              </a>
              <a href="#how" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                Comment ça marche
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                Témoignages
              </a>
              <SimpleThemeToggle />
              <Link href="/onboarding">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-6 shadow-md hover:shadow-lg transition-all">
                  Démarrer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-b from-red-50/30 to-white">
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
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  Automatisez vos ventes sur{" "}
                  <span className="text-red-500">WhatsApp</span> avec l'IA
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Restaurants, boutiques, commerces : ne perdez plus jamais un client.
                Votre assistant IA répond, présente vos produits et prend les commandes 24/7 sur WhatsApp.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/onboarding">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Commencer maintenant
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-6 text-lg font-semibold transition-all"
                >
                  Voir la démo
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Configuration en 15 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Sans engagement</span>
                </div>
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
                {/* Floating elements for visual interest */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">+40% ventes</p>
                      <p className="text-xs text-gray-500">Ce mois</p>
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
                  className="absolute bottom-10 -right-10 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">IA Active</p>
                      <p className="text-xs text-gray-500">24/7</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12"
          >
            Reconnu par les commerces les plus dynamiques du Sénégal
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60"
          >
            {["Restaurant", "Boutique", "Café", "Boulangerie", "Superette", "Fast Food"].map((type, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <span className="text-2xl">{["🍽️", "🛍️", "☕", "🥖", "🏪", "🍔"][i]}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">{type}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Avec <span className="text-red-500">Mafal-IA</span>, passez à la vitesse supérieure
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour automatiser vos ventes, gérer vos commandes et faire grandir votre commerce
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl text-center border border-red-100"
              >
                <div className="text-5xl font-bold text-red-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tout ce qu'il faut pour réussir
            </h2>
            <p className="text-xl text-gray-600">
              Une solution complète pensée pour les commerçants africains
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
                <Card className="p-6 h-full bg-white border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Commencez à automatiser vos ventes en 15 min
            </h2>
            <p className="text-xl text-gray-600">
              3 étapes simples pour transformer votre business
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
                title: "Créez votre compte",
                desc: "Inscrivez-vous en 2 minutes avec votre email",
                icon: <Users className="h-8 w-8" />
              },
              {
                step: "2",
                title: "Ajoutez vos produits",
                desc: "Importez votre catalogue avec photos et prix",
                icon: <Package className="h-8 w-8" />
              },
              {
                step: "3",
                title: "Connectez WhatsApp",
                desc: "Liez votre compte et laissez l'IA gérer",
                icon: <Zap className="h-8 w-8" />
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <Card className="p-8 bg-white border-2 border-gray-200 hover:border-red-300 transition-all duration-300 h-full">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-4 mb-4 text-red-500">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Découvrez ce que nos clients disent
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des centaines de commerces qui font confiance à Mafal-IA
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
                <Card className="p-8 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-1 mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Award key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
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
              Prêt à transformer votre business ?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Rejoignez les commerçants qui utilisent Mafal-IA pour automatiser leurs ventes et grandir. Configuration simple en 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Créer mon compte gratuitement
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold transition-all"
              >
                Parler à un conseiller
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="h-10 mb-4 brightness-0 invert" />
              <p className="text-sm text-gray-400">
                Automatisez vos ventes sur WhatsApp avec l'intelligence artificielle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#how" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2026 Mafal-IA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
