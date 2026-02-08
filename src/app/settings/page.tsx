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
  Smartphone,
  CheckCircle2,
  ChevronRight
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-1 text-sm text-gray-500">
          <Button variant="ghost" className="justify-start gap-2 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-medium shadow-sm ring-1 ring-red-100 dark:ring-red-900/20">
            <SettingsIcon className="h-4 w-4" /> General
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
            <User className="h-4 w-4" /> Account
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 p-0.5 px-2 h-5 text-[10px]">New</Badge>
            <Globe className="h-4 w-4" order-first /> Organization
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
            <CreditCard className="h-4 w-4" /> Billing
          </Button>
          <Button variant="ghost" className="justify-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
        </nav>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Organization Profile</CardTitle>
              <CardDescription>
                Update your organization details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Acme Inc." defaultValue="Mafalia Foods" className="focus-visible:ring-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input id="org-email" type="email" placeholder="contact@example.com" className="focus-visible:ring-red-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-4 justify-end">
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all hover:scale-[1.02]">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Integrations</CardTitle>
              <CardDescription>
                Manage your connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center border border-green-200 dark:border-green-900/30 group-hover:scale-105 transition-transform duration-300">
                    <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">WhatsApp Business API</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50 text-[10px] h-5 px-1.5">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Connect your WhatsApp Business account to receive orders.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="group-hover:border-gray-300 dark:group-hover:border-gray-600">Configure</Button>
              </div>

              <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border border-blue-200 dark:border-blue-900/30 group-hover:scale-105 transition-transform duration-300">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">Neon Database</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50 text-[10px] h-5 px-1.5">Operational</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Managed Postgres database for your data.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="group-hover:border-gray-300 dark:group-hover:border-gray-600">View Metrics</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Order Alerts</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new incoming orders.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Daily Summary</Label>
                  <p className="text-sm text-gray-500">Get a daily summary of your business performance.</p>
                </div>
                <Switch className="data-[state=checked]:bg-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
