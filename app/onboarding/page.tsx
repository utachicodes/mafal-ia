"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle2, MessageSquare, Store, QrCode } from "lucide-react"
import { useRestaurants } from "@/src/hooks/use-restaurants"
import { useToast } from "@/hooks/use-toast"
// Removed AIClientBrowser mock usage; parse JSON locally

export default function OnboardingPage() {
  const { addRestaurant } = useRestaurants()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const router = useRouter()

  // Step 1 – Basic info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("en")

  // Step 2 – Menu upload
  const [menuJson, setMenuJson] = useState("")
  const [parsedItems, setParsedItems] = useState<any[]>([])
  const [isParsing, setIsParsing] = useState(false)

  // Step 3 – Connect WhatsApp (guide)
  const [whatsAppNumber, setWhatsAppNumber] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)

  const next = () => setStep((s) => Math.min(4, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const parseMenu = async () => {
    setIsParsing(true)
    try {
      const raw = menuJson.trim()
      if (!raw) throw new Error("Empty JSON")
      const parsed = JSON.parse(raw)
      const items = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as any)?.items)
          ? (parsed as any).items
          : []
      if (!Array.isArray(items)) throw new Error("Expected an array of items")
      setParsedItems(items)
      toast({ title: "Menu parsed", description: `${items.length} items detected.` })
    } catch (e) {
      toast({ title: "Invalid JSON", description: "Please provide a valid JSON menu.", variant: "destructive" })
    } finally {
      setIsParsing(false)
    }
  }

  const simulateGenerateQr = () => {
    setQrGenerated(true)
    toast({ title: "QR generated", description: "Scan with WhatsApp to link this number." })
  }

  const simulateScan = () => {
    if (!whatsAppNumber.trim()) {
      toast({ title: "Phone required", description: "Enter a WhatsApp number to link.", variant: "destructive" })
      return
    }
    if (!qrGenerated) {
      toast({ title: "Generate QR first", description: "Click Generate QR, then Simulate Scan.", variant: "destructive" })
      return
    }
    setQrScanned(true)
    toast({ title: "Scan simulated", description: `Linked to ${whatsAppNumber}. Will be saved on Finish.` })
  }

  const finish = () => {
    const restaurantData = {
      name: name || "My Restaurant",
      description: description || "",
      cuisine: "",
      whatsappNumber: whatsAppNumber || "",
      supportedLanguages: [language],
      isActive: true,
      menu: parsedItems.map((p: any, idx: number) => ({
        id: String(idx + 1),
        name: String(p.name ?? `Item ${idx + 1}`),
        description: String(p.description ?? ""),
        price: Number(p.price ?? 0),
        category: p.category ? String(p.category) : undefined,
        isAvailable: p.isAvailable ?? true,
      })),
      chatbotContext: {
        welcomeMessage:
          "Welcome! Ask me about the menu, opening hours and delivery. I can help you place orders and book tables.",
        businessHours: "",
        specialInstructions: "",
        orderingEnabled: true,
        deliveryInfo: "",
      },
      apiCredentials: {
        whatsappAccessToken: "",
        whatsappPhoneNumberId: "",
        webhookVerifyToken: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const newId = addRestaurant(restaurantData as any)
    toast({ title: "Assistant created", description: "You can now test it in the Playground." })
    setStep(4)
    // Navigate to playground pre-selecting the new restaurant
    router.push(`/playground?select=${encodeURIComponent(newId)}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Onboarding</h1>
            <p className="text-muted-foreground">Create your first assistant in minutes.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className={step >= 1 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5"/>Basic Info</CardTitle>
              <CardDescription>Restaurant details and language</CardDescription>
            </CardHeader>
          </Card>
          <Card className={step >= 2 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/>Menu Upload</CardTitle>
              <CardDescription>Paste or upload JSON</CardDescription>
            </CardHeader>
          </Card>
          <Card className={step >= 3 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/>Connect WhatsApp</CardTitle>
              <CardDescription>Scan and go (guide)</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>We’ll use this to personalize your assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chez Fatou" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Authentic Senegalese cuisine"/>
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="wo">Wolof</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={next} disabled={!name.trim()}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Menu (JSON)</CardTitle>
              <CardDescription>Paste JSON array or object with an "items" array.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea rows={8} value={menuJson} onChange={(e) => setMenuJson(e.target.value)} placeholder='[{"name":"Thieboudienne","price":3500}]' />
              <div className="flex gap-2">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={parseMenu} disabled={!menuJson.trim() || isParsing}>{isParsing ? "Parsing..." : "Parse Menu"}</Button>
                <Button onClick={next} disabled={parsedItems.length === 0}>Continue</Button>
              </div>
              {parsedItems.length > 0 && (
                <div className="text-sm text-muted-foreground">Detected {parsedItems.length} item(s). Proceed to finish setup.</div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Connect WhatsApp</CardTitle>
              <CardDescription>For development, you can use the Playground without WhatsApp. When ready, scan the QR in your WhatsApp Web session to bind your number in production.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wa">WhatsApp Number (optional)</Label>
                <Input id="wa" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="e.g. +221771234567" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-medium">Quick Connect (QR Simulator)</p>
                  <div className="w-44 h-44 border rounded grid place-content-center text-muted-foreground bg-muted/20">
                    <QrCode className="h-20 w-20"/>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={simulateGenerateQr}>Generate QR</Button>
                    <Button type="button" variant="outline" onClick={simulateScan}>Simulate Scan</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Status: {qrScanned ? "Connected (will be saved on Finish)" : qrGenerated ? "QR ready, waiting for scan" : "Not generated"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground mb-1">Official WhatsApp API (Optional)</p>
                  <p>Use WhatsApp Business API for team inbox, templates, and scale. Requires Meta approval and a BSP.</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={finish}>Finish Setup</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-green-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-5 w-5"/>All set!</CardTitle>
              <CardDescription>Your assistant is created. Head to the Playground to start chatting.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <a href="/playground">
                  <Button>Go to Playground</Button>
                </a>
                <a href="/whatsapp/quick-connect">
                  <Button variant="outline">Quick Connect WhatsApp</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
