"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/src/components/logo";
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle";
import { MessageSquare, Bot, Globe, Zap, ArrowRight, Store, Smartphone, TrendingUp } from "lucide-react";

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 relative overflow-hidden">
      {/* Enhanced animated background blobs with continuous movement */}
      <div className="blob-base blob-float blob-pulse top-[-8rem] right-[-8rem] h-[22rem] w-[22rem] bg-primary/20 animate-pulse" />
      <div className="blob-base blob-float-slow top-[20%] left-[-6rem] h-[18rem] w-[18rem] bg-emerald-500/15 animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="blob-base blob-float bottom-[-10rem] right-[10%] h-[20rem] w-[20rem] bg-fuchsia-500/10 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/10 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-12" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <SimpleThemeToggle />
              <Link href="/onboarding">
                <Button size="sm" className="shadow-sm">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">

            <div className="text-lg font-medium text-primary mb-6 animate-in slide-in-from-bottom-2 hover:scale-105 transition-transform duration-300">
              Noo ngi fi pour jàppal
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[0.9] tracking-tight animate-in fade-in-50 delay-100">
              Automatisez vos ventes
              <br />
              <span className="relative inline-block">
                sur WhatsApp
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full animate-in slide-in-from-left-full duration-1000 delay-700"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-in fade-in-50 delay-200">
              Restaurants, boutiques, commerces : ne perdez plus de clients.
              Laissez notre IA prendre les commandes et répondre aux questions 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in zoom-in-50 delay-300">
              <Link href="/onboarding">
                <Button size="lg" className="px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.05] animate-pulse hover:animate-none group">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tout ce qu'il faut pour vendre
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conçu pour le commerce informel et moderne en Afrique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:rotate-1 p-8 animate-in fade-in-50 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Store className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Vente Automatique</h3>
              <p className="text-muted-foreground leading-relaxed">L'IA présente vos produits et prend les commandes directement dans WhatsApp.</p>
            </Card>

            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:-rotate-1 p-8 animate-in fade-in-50 delay-100 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Multilingue</h3>
              <p className="text-muted-foreground leading-relaxed">Français, Anglais, Wolof, Arabe. Parlez la langue de vos clients.</p>
            </Card>

            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:-rotate-1 p-8 animate-in fade-in-50 delay-150 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Smartphone className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">100% Mobile</h3>
              <p className="text-muted-foreground leading-relaxed">Gérez tout depuis votre téléphone. Pas besoin d'ordinateur.</p>
            </Card>

            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:-rotate-1 p-8 animate-in fade-in-50 delay-200 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Croissance</h3>
              <p className="text-muted-foreground leading-relaxed">Augmentez vos revenus en ne ratant jamais une vente, même la nuit.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Comment ça marche ?</h2>
            <p className="text-xl text-muted-foreground">3 étapes simples pour vendre plus</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Inscrivez-vous", desc: "Créez votre profil commercial en 2 minutes." },
              { step: "2", title: "Ajoutez vos produits", desc: "Prenez une photo ou listez vos articles." },
              { step: "3", title: "Automatisez", desc: "Connectez votre WhatsApp et laissez l'IA gérer." },
            ].map((item, index) => (
              <Card key={index} className="bg-card border-border/50 p-6 text-center hover:shadow-lg hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:animate-bounce group-hover:bg-primary/80">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-primary to-primary/90 border-0 text-primary-foreground text-center p-16 max-w-5xl mx-auto shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 animate-pulse hover:animate-none">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-in fade-in-50">
              Prêt à booster vos ventes ?
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 delay-200">
              Rejoignez les commerçants qui utilisent Mafal-ia pour grandir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in zoom-in-50 delay-400">
              <Link href="/onboarding">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all group">
                  Créer mon compte
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
