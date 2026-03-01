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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1 text-sm">
          <Button variant="ghost" className="justify-start gap-2 bg-primary/10 text-primary font-medium">
            <SettingsIcon className="h-4 w-4" /> General
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <User className="h-4 w-4" /> Account
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Globe className="h-4 w-4" /> Organization
            <Badge variant="outline" className="ml-auto text-[10px] h-5 px-1.5">New</Badge>
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <CreditCard className="h-4 w-4" /> Billing
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
        </nav>

        <div className="space-y-6">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg font-semibold">Organization Profile</CardTitle>
              <CardDescription>
                Update your organization details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Acme Inc." defaultValue="Mafalia Foods" className="h-10 bg-muted border-border rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input id="org-email" type="email" placeholder="contact@example.com" className="h-10 bg-muted border-border rounded-lg" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border py-4 justify-end">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg font-semibold">Integrations</CardTitle>
              <CardDescription>
                Manage your connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">WhatsApp Business API</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px] h-5 px-1.5">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Connect your WhatsApp Business account to receive orders.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">Database</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px] h-5 px-1.5">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">Your data is stored securely.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new incoming orders.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Daily Summary</Label>
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
