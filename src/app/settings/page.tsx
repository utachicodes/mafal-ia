import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Cpu,
  Globe,
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Zap
} from "lucide-react"

export default function SettingsPage() {
  const systemStatus = [
    { name: "Database", status: "Operational", icon: Database, color: "text-green-500" },
    { name: "AI Engine", status: "Healthy", icon: Cpu, color: "text-green-500" },
    { name: "WhatsApp Gateway", status: "Active", icon: Globe, color: "text-green-500" },
    { name: "Auth Service", status: "Operational", icon: ShieldCheck, color: "text-green-500" },
  ]

  const integrations = [
    { name: "WhatsApp Cloud API", status: "Connected", icon: Smartphone, details: "Meta Business Account" },
    { name: "Google GenKit", status: "Active", icon: Zap, details: "Gemini 1.5 Pro" },
  ]

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient flex items-center gap-3">
            <SettingsIcon className="h-10 w-10 text-primary" /> System Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your global application configuration and monitor system health.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* System Health */}
        <Card className="lg:col-span-1 glass border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> System Health
            </CardTitle>
            <CardDescription>Real-time status of core components</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/5 shadow-sm">
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
          <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/30 dark:bg-black/10 px-8 py-6">
              <CardTitle className="text-xl">Platform Integrations</CardTitle>
              <CardDescription>External services powering Mafal-IA</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-white/5">
              <div className="divide-y divide-white/5">
                {integrations.map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-8 py-6 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-black tracking-tight">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      Configure <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-orange-500/5 px-8 py-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-500" /> Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold tracking-tight">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                  </div>
                  <Button className="rounded-full shadow-lg shadow-primary/20">Enable 2FA</Button>
                </div>
                <div className="h-px md:h-auto md:w-px bg-white/10" />
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold tracking-tight">API Key Management</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Generate and revoke API keys for your applications to securely interact with the platform.</p>
                  </div>
                  <Button variant="outline" className="rounded-full">Manage Keys</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
