"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download, Upload, Trash2, Bell, Palette, MessageSquare, Plug, FileText } from "lucide-react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { LocalStorage } from "@/src/lib/storage"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // General Settings
  const [companyName, setCompanyName] = useState("Mafal-IA")
  const [supportEmail, setSupportEmail] = useState("support@mafal-ia.com")
  const [defaultLanguage, setDefaultLanguage] = useState("en")

  // AI Settings
  const [aiModel, setAiModel] = useState("gemini-1.5-flash")
  const [responseTimeout, setResponseTimeout] = useState("30")
  const [maxTokens, setMaxTokens] = useState("1000")

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [webhookNotifications, setWebhookNotifications] = useState(false)
  const [dailyReports, setDailyReports] = useState(true)

  // System Settings
  const [ipWhitelist, setIpWhitelist] = useState("")

  // Assistant Settings
  const [assistantTone, setAssistantTone] = useState("friendly")
  const [tplGreeting, setTplGreeting] = useState("Hello! I can help with menu, prices and orders.")
  const [tplBooking, setTplBooking] = useState("Your booking is confirmed for {{datetime}}. See you soon!")
  const [tplClosing, setTplClosing] = useState("Thanks for reaching out!")

  // Integrations
  const [calendarProvider, setCalendarProvider] = useState<string>("none")
  const [crmWebhookUrl, setCrmWebhookUrl] = useState("")

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const payload = {
        companyName,
        supportEmail,
        emailNotifications,
        webhookNotifications,
        dailyReports,
        twoFactorAuth,
        sessionTimeout,
        ipWhitelist,
        assistantTone,
        templates: {
          greeting: tplGreeting,
          booking: tplBooking,
          closing: tplClosing,
        },
        calendarProvider,
        crmWebhookUrl,
      }
      LocalStorage.saveSettings(payload)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load settings on mount
  useEffect(() => {
    const s = LocalStorage.loadSettings()
    if (!s) return
    setCompanyName(s.companyName ?? companyName)
    setSupportEmail(s.supportEmail ?? supportEmail)
    setEmailNotifications(Boolean(s.emailNotifications))
    setWebhookNotifications(Boolean(s.webhookNotifications))
    setDailyReports(Boolean(s.dailyReports))
    setTwoFactorAuth(Boolean(s.twoFactorAuth))
    setSessionTimeout(String(s.sessionTimeout ?? sessionTimeout))
    setIpWhitelist(String(s.ipWhitelist ?? ""))
    setAssistantTone(String(s.assistantTone ?? assistantTone))
    setTplGreeting(String(s.templates?.greeting ?? tplGreeting))
    setTplBooking(String(s.templates?.booking ?? tplBooking))
    setTplClosing(String(s.templates?.closing ?? tplClosing))
    setCalendarProvider(String(s.calendarProvider ?? calendarProvider))
    setCrmWebhookUrl(String(s.crmWebhookUrl ?? crmWebhookUrl))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export will be ready shortly.",
    })
  }

  const handleImportData = () => {
    toast({
      title: "Import feature",
      description: "Data import functionality will be available soon.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your platform configuration and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI & Models</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="wo">Wolof</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI & Model Configuration</CardTitle>
                <CardDescription>Configure AI models and response parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model</Label>
                    <Select value={aiModel} onValueChange={setAiModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response-timeout">Response Timeout (seconds)</Label>
                    <Input
                      id="response-timeout"
                      type="number"
                      value={responseTimeout}
                      onChange={(e) => setResponseTimeout(e.target.value)}
                      min="5"
                      max="120"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    min="100"
                    max="4000"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how you receive notifications and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to external webhooks</p>
                  </div>
                  <Switch checked={webhookNotifications} onCheckedChange={setWebhookNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive daily analytics reports</p>
                  </div>
                  <Switch checked={dailyReports} onCheckedChange={setDailyReports} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export, import, and manage your platform data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button onClick={handleImportData} variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your entire platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assistant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/>Assistant Settings</CardTitle>
                <CardDescription>Control tone and default templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assistant Tone</Label>
                    <Select value={assistantTone} onValueChange={setAssistantTone}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Greeting Template</Label>
                  <Textarea value={tplGreeting} onChange={(e) => setTplGreeting(e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Booking Confirmation Template</Label>
                  <Textarea value={tplBooking} onChange={(e) => setTplBooking(e.target.value)} rows={2} />
                  <p className="text-xs text-muted-foreground">{"You can use variables like {{datetime}}, {{name}}"}</p>
                </div>
                <div className="space-y-2">
                  <Label>Closing Template</Label>
                  <Textarea value={tplClosing} onChange={(e) => setTplClosing(e.target.value)} rows={2} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plug className="h-5 w-5"/>Integrations</CardTitle>
                <CardDescription>Connect calendars and CRMs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calendar Provider</Label>
                    <Select value={calendarProvider} onValueChange={setCalendarProvider}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM/Webhook URL</Label>
                    <Input id="crm" value={crmWebhookUrl} onChange={(e) => setCrmWebhookUrl(e.target.value)} placeholder="https://hooks.zapier.com/..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Compliance</CardTitle>
                <CardDescription>Privacy, GDPR/CCPA and DPA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <a href="/legal/dpa" className="underline text-primary">View/Download DPA</a>
                  <a href="/privacy" className="underline">Privacy Policy</a>
                  <a href="/security" className="underline">Security Overview</a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
