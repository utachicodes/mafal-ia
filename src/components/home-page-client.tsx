"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/src/components/logo";
import { SimpleThemeToggle } from "@/src/components/simple-theme-toggle";
import { MessageSquare, Bot, Globe, Zap, CheckCircle2, Shield, Phone, Layers, Rocket, ArrowRight, Star } from "lucide-react";

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 relative overflow-hidden">
      {/* Enhanced animated background blobs with continuous movement */}
      <div className="blob-base blob-float blob-pulse top-[-8rem] right-[-8rem] h-[22rem] w-[22rem] bg-primary/20 animate-pulse" />
      <div className="blob-base blob-float-slow top-[20%] left-[-6rem] h-[18rem] w-[18rem] bg-emerald-500/15 animate-bounce" style={{animationDuration: '3s'}} />
      <div className="blob-base blob-float bottom-[-10rem] right-[10%] h-[20rem] w-[20rem] bg-fuchsia-500/10 animate-pulse" style={{animationDelay: '1s'}} />
      
      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-ping" style={{animationDuration: '2s'}} />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-primary/20 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}} />
      <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary/40 rounded-full animate-ping" style={{animationDuration: '2.5s', animationDelay: '1s'}} />

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
              <a href="#whatsapp" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
              <SimpleThemeToggle />
              <Link href="/restaurants">
                <Button size="sm" className="shadow-sm">
                  Get started
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
              Build WhatsApp agents
              <br />
              <span className="relative inline-block">
                for your restaurants
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full animate-in slide-in-from-left-full duration-1000 delay-700"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-in fade-in-50 delay-200">
              Paste your menu, add your WhatsApp credentials, verify the webhook, and go live. 
              AI answers in French, English, Wolof, or Arabic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in zoom-in-50 delay-300">
              <Link href="/restaurants">
                <Button size="lg" className="px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.05] animate-pulse hover:animate-none group">
                  Create your agent
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-semibold hover:scale-[1.05] transition-all hover:bg-primary hover:text-primary-foreground">
                  View dashboard
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
              Everything you need to launch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Purpose-built for restaurants with intelligent AI that understands your menu and customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:rotate-1 p-8 animate-in fade-in-50 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Bot className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Menu‑aware AI</h3>
              <p className="text-muted-foreground leading-relaxed">Understands intent and your menu to answer questions and take orders accurately.</p>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:-rotate-1 p-8 animate-in fade-in-50 delay-100 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-spin" style={{animationDuration: '8s'}} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Multilingual</h3>
              <p className="text-muted-foreground leading-relaxed">French, English, Wolof, Arabic automatically detected and supported.</p>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:rotate-1 p-8 animate-in fade-in-50 delay-150 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-bounce" style={{animationDuration: '2s'}} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">WhatsApp‑native</h3>
              <p className="text-muted-foreground leading-relaxed">Works seamlessly with your WhatsApp Business API and phone number.</p>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] hover:-rotate-1 p-8 animate-in fade-in-50 delay-200 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-8 w-8 text-primary group-hover:scale-110 transition-transform animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Fast setup</h3>
              <p className="text-muted-foreground leading-relaxed">Go from menu to live agent in under 15 minutes with guided setup.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground">
              Five simple steps to your WhatsApp agent
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Restaurant", desc: "Add name, description, and operating hours" },
              { step: "2", title: "Menu", desc: "Paste JSON, CSV, or text—we auto-structure it" },
              { step: "3", title: "WhatsApp", desc: "Enter credentials: phone ID, tokens, secrets" },
              { step: "4", title: "Verify", desc: "Test webhook with GET verify and signed POST" },
              { step: "5", title: "Go live", desc: "Start taking orders via WhatsApp instantly" }
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

      {/* Integration Section */}
      <section id="whatsapp" className="relative z-10 py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                WhatsApp integration made simple
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Multi‑tenant by design. Each restaurant stores its own credentials for maximum security and flexibility.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg text-foreground">Per‑restaurant App Secret for signature validation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg text-foreground">Per‑restaurant Access Token override</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg text-foreground">Per‑restaurant Verify Token for webhook setup</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-card/80 backdrop-blur border-0 shadow-xl p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">Why Mafal‑IA</h3>
                    <p className="text-muted-foreground">Purpose‑built for restaurants in Senegal and beyond</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Menu‑aware answers and order totals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Delivery zones and ETA hints</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Concierge mode across multiple brands</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-primary to-primary/90 border-0 text-primary-foreground text-center p-16 max-w-5xl mx-auto shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 animate-pulse hover:animate-none">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-in fade-in-50">
              Ready to launch your WhatsApp agent?
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 delay-200">
              Create your first restaurant and start taking orders through WhatsApp today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in zoom-in-50 delay-400">
              <Link href="/restaurants">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all group">
                  Get started now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-10 py-4 text-lg font-semibold hover:scale-[1.05] transition-all">
                  View dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
