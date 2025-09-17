"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle2, MessageSquare, Store, QrCode } from "lucide-react"
import { type Restaurant } from "@/lib/data"
import { autoDetectMenuFromString } from "@/src/lib/data-utils"
import { useToast } from "@/hooks/use-toast"
// Removed AIClientBrowser mock usage; parse JSON locally

export default function OnboardingPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const router = useRouter()

  // Step 1 – Basic info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  // Default English; language selection removed
  const language = "en"

  // Step 2 – Menu upload
  const [menuRaw, setMenuRaw] = useState("")
  const [parsedItems, setParsedItems] = useState<any[]>([])
  const [isParsing, setIsParsing] = useState(false)

  // Step 3 – Connect WhatsApp (guide)
  const [whatsAppNumber, setWhatsAppNumber] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)
  // Per-restaurant WhatsApp credentials (multi-tenant)
  const [waPhoneId, setWaPhoneId] = useState("")
  const [waAccessToken, setWaAccessToken] = useState("")
  const [waAppSecret, setWaAppSecret] = useState("")
  const [waVerifyToken, setWaVerifyToken] = useState("")

  const next = () => setStep((s: number) => Math.min(4, s + 1))
  const prev = () => setStep((s: number) => Math.max(1, s - 1))

  const parseMenu = async () => {
    setIsParsing(true)
    try {
      const raw = menuRaw.trim()
      if (!raw) throw new Error("Empty JSON")
      const items = autoDetectMenuFromString(raw)
      setParsedItems(items)
      toast({ title: "Menu parsed", description: `${items.length} items detected.` })
    } catch (e) {
      toast({ title: "Invalid menu", description: "Paste JSON, CSV, or simple text lines.", variant: "destructive" })
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

  const finish = async () => {
    // Require WhatsApp number and credentials to generate a usable webhook/agent
    if (!whatsAppNumber.trim() || !waPhoneId.trim() || !waAccessToken.trim() || !waAppSecret.trim() || !waVerifyToken.trim()) {
      toast({
        title: "Missing WhatsApp credentials",
        description: "Please fill WhatsApp number, phone_number_id, access token, app secret, and verify token.",
        variant: "destructive",
      })
      return
    }
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
        whatsappAccessToken: waAccessToken,
        whatsappPhoneNumberId: waPhoneId,
        webhookVerifyToken: waVerifyToken,
        whatsappAppSecret: waAppSecret,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      })
      if (!response.ok) throw new Error(`Failed to create restaurant (${response.status})`)
      const saved: Restaurant = await response.json()
      toast({ title: "Assistant created", description: "Webhook can now be verified in Meta." })
      setStep(4)
      router.push(`/restaurants/${encodeURIComponent(saved.id)}`)
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || "Unable to save restaurant.", variant: "destructive" })
    }
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
                <Input id="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Chez Fatou" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Authentic Senegalese cuisine"/>
              </div>
              {/* Language selection removed; default to English */}
              <div className="flex justify-end gap-2">
                <Button onClick={next} disabled={!name.trim()}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Menu (JSON / CSV / Text)</CardTitle>
              <CardDescription>Paste JSON, CSV, or simple one-item-per-line text. We auto-detect the format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea rows={8} value={menuRaw} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMenuRaw(e.target.value)} placeholder='JSON: [{"name":"Thieboudienne","price":3500}]\nCSV: name,description,price\nThieboudienne,Rice & fish,3500\nText: Thieboudienne - Rice & fish - 3500' />
              <div className="flex gap-2">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={parseMenu} disabled={!menuRaw.trim() || isParsing}>{isParsing ? "Parsing..." : "Parse Menu"}</Button>
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
                <Label htmlFor="wa">WhatsApp Number</Label>
                <Input id="wa" value={whatsAppNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsAppNumber(e.target.value)} placeholder="e.g. +221771234567" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-medium">Per-restaurant WhatsApp Credentials</p>
                  <div className="space-y-2">
                    <Label htmlFor="wa-phone-id">phone_number_id</Label>
                    <Input id="wa-phone-id" value={waPhoneId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaPhoneId(e.target.value)} placeholder="123456789012345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wa-access">Access Token</Label>
                    <Input id="wa-access" type="password" value={waAccessToken} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaAccessToken(e.target.value)} placeholder="EAAB..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wa-secret">App Secret</Label>
                    <Input id="wa-secret" type="password" value={waAppSecret} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaAppSecret(e.target.value)} placeholder="your app secret" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wa-verify">Webhook Verify Token</Label>
                    <Input id="wa-verify" value={waVerifyToken} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaVerifyToken(e.target.value)} placeholder="choose-any-token" />
                  </div>
                  <p className="text-xs text-muted-foreground">These are saved per restaurant and used to route and validate messages. You can leave them empty and add later, but you will need them to verify the webhook in Meta.</p>
                </div>
                <div className="space-y-3">
                  <p className="font-medium">Webhook Details</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground">URL:</span> <code>/api/whatsapp</code></div>
                    <div><span className="font-medium text-foreground">Verify Token:</span> <code>{waVerifyToken || "<set above>"}</code></div>
                  </div>
                </div>
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
                <Button onClick={finish} disabled={!name.trim() || parsedItems.length === 0 || !whatsAppNumber.trim() || !waPhoneId.trim() || !waAccessToken.trim() || !waAppSecret.trim() || !waVerifyToken.trim()}>Finish Setup</Button>
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
