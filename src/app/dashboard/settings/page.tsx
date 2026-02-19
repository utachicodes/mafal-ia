"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Settings as SettingsIcon,
  Database,
  Globe,
  Bell,
  User,
  CreditCard,
  Smartphone,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8 py-2 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-1 text-sm text-muted-foreground">
          <Button variant="ghost" className="justify-start gap-2 bg-primary/10 text-primary font-medium">
            <SettingsIcon className="h-4 w-4" /> General
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-white/5 hover:text-foreground transition-colors">
            <User className="h-4 w-4" /> Account
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-white/5 hover:text-foreground transition-colors">
            <Globe className="h-4 w-4" /> Organization
            <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 p-0.5 px-2 h-5 text-[10px]">New</Badge>
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-white/5 hover:text-foreground transition-colors">
            <CreditCard className="h-4 w-4" /> Billing
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-white/5 hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
        </nav>

        <div className="space-y-6">
          <Card className="glass border-white/10">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-xl font-semibold">Organization Profile</CardTitle>
              <CardDescription>
                Update your organization details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Acme Inc." defaultValue="Mafalia Foods" className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input id="org-email" type="email" placeholder="contact@example.com" className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 py-4 justify-end">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-xl font-semibold">Integrations</CardTitle>
              <CardDescription>
                Manage your connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Smartphone className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">WhatsApp Business API</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] h-5 px-1.5">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Connect your WhatsApp Business account to receive orders.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">Configure</Button>
              </div>

              <div className="flex items-start justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Database</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] h-5 px-1.5">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Your data is stored securely.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">View</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new incoming orders.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Daily Summary</Label>
                  <p className="text-sm text-muted-foreground">Get a daily summary of your business performance.</p>
                </div>
                <Switch className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
