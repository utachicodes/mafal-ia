"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Cpu,
  Globe,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Lock,
  Zap,
  Activity
} from "lucide-react"

export default function SettingsPage() {
  const systemStatus = [
    { name: "Database", status: "Operational", icon: Database, color: "text-green-500" },
    { name: "Automation System", status: "Healthy", icon: Cpu, color: "text-amber-500" },
    { name: "WhatsApp Gateway", status: "Active", icon: Globe, color: "text-green-500" },
    { name: "Auth Service", status: "Operational", icon: ShieldCheck, color: "text-green-500" },
  ]

  const integrations = [
    { name: "WhatsApp Cloud API", status: "Connected", icon: Smartphone, details: "Meta Business Account" },
    { name: "Google GenKit", status: "Active", icon: Zap, details: "Gemini 1.5 Pro" },
  ]

  return (
    <div className="space-y-12 py-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-pulse">
            <SettingsIcon className="h-3 w-3" /> Core Infrastructure
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gradient flex items-center gap-4">
            System Settings
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Configure your global AI parameters and monitor system health.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* System Health */}
        <Card className="lg:col-span-1 glass border-none shadow-3xl rounded-[32px] overflow-hidden group">
          <CardHeader className="bg-primary/5 pb-8 pt-8">
            <CardTitle className="text-xl flex items-center gap-3 font-black">
              <Activity className="h-5 w-5 text-primary" /> System Health
            </CardTitle>
            <CardDescription className="font-medium opacity-80">Real-time status of core components</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/5 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-muted/50 ${service.color}`}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <span className="font-bold tracking-tight text-sm">{service.name}</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">{service.status}</span>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configurations */}
        <div className="lg:col-span-2 space-y-8">
          {/* API Integrations */}
          <Card className="glass border-none shadow-3xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-white/30 dark:bg-black/10 px-8 py-8 border-b border-white/5">
              <CardTitle className="text-xl font-black">Platform Integrations</CardTitle>
              <CardDescription className="opacity-80">External services powering Mafal-IA</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {integrations.map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-8 py-6 hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="font-black tracking-tight text-lg group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">{item.details}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full gap-2 font-bold border-primary/20 hover:bg-primary/10 hover:text-primary transition-all">
                      Configure <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass border-none shadow-3xl rounded-[32px] overflow-hidden">
            <CardHeader className="bg-orange-500/5 px-8 py-6 border-b border-orange-500/10">
              <CardTitle className="text-xl flex items-center gap-3 font-black">
                <Lock className="h-5 w-5 text-orange-500" /> Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold tracking-tight text-lg">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                  </div>
                  <Button className="rounded-2xl shadow-lg shadow-primary/20 font-bold">Enable 2FA</Button>
                </div>
                <div className="h-px md:h-auto md:w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold tracking-tight text-lg">API Key Management</p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">Generate and revoke API keys for your applications to securely interact with the platform.</p>
                  </div>
                  <Button variant="outline" className="rounded-2xl font-bold bg-transparent">Manage Keys</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
