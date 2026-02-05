"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Globe,
  Bell,
  Mail,
  User,
  CreditCard,
  LogOut,
  Smartphone
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 py-6 max-w-5xl">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-1 text-sm text-gray-500">
          <Button variant="ghost" className="justify-start gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
            <SettingsIcon className="h-4 w-4" /> General
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <User className="h-4 w-4" /> Account
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 bg-transparent border-none p-0 h-auto">New</Badge>
            <Globe className="h-4 w-4" order-first /> Organization
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
        </nav>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Organization Profile</CardTitle>
              <CardDescription>
                Update your organization details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Acme Inc." defaultValue="Mafalia Foods" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input id="org-email" type="email" placeholder="contact@example.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-4 justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</CardTitle>
              <CardDescription>
                Manage your connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-10 w-10 mt-1 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-900/30">
                    <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp Business API</p>
                    <p className="text-sm text-gray-500">Connect your WhatsApp Business account to receive orders.</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Connected</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-10 w-10 mt-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Neon Database</p>
                    <p className="text-sm text-gray-500">Managed Postgres database for your data.</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Operational</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Metrics</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Order Alerts</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new incoming orders.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Daily Summary</Label>
                  <p className="text-sm text-gray-500">Get a daily summary of your business performance.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
