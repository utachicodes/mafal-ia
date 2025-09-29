"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WhatsAppIntegrationStatus } from "@/components/whatsapp-integration-status"

export default function WhatsAppToolPage() {
  const [restaurants, setRestaurants] = useState<Array<any>>([])
  const [restaurantId, setRestaurantId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  // Secrets no longer shown in UI. We keep local placeholders for status component only if needed.
  const [verifyToken, setVerifyToken] = useState("")
  const [businessAccountId, setBusinessAccountId] = useState("")

  const [testTo, setTestTo] = useState("")
  const [testBody, setTestBody] = useState("")
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string>("")

  // Template related
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [languageCode, setLanguageCode] = useState("en")
  const [templateParams, setTemplateParams] = useState("")
  const [templateVariables, setTemplateVariables] = useState<number>(0)

  useEffect(() => {
    // load restaurants for selection
    const load = async () => {
      try {
        const res = await fetch('/api/tools/restaurants')
        const data = await res.json()
        if (data?.ok) setRestaurants(data.restaurants || [])
      } catch {}
    }
    load()
  }, [])

  useEffect(() => {
    // whenever we have business account + restaurant, load templates server-side (no tokens in browser)
    const loadTemplates = async () => {
      if (!businessAccountId || !restaurantId) return
      try {
        const url = `/api/tools/whatsapp/templates?businessAccountId=${encodeURIComponent(businessAccountId)}&restaurantId=${encodeURIComponent(restaurantId)}`
        const res = await fetch(url)
        const data = await res.json()
        if (data?.ok) setTemplates(data.templates || [])
      } catch {}
    }
    loadTemplates()
  }, [businessAccountId, restaurantId])

  const onSelectRestaurant = (id: string) => {
    setRestaurantId(id)
    // In secure mode, we don't fetch secrets client-side.
    // Optionally you can fetch verify token in a protected route for status widget.
  }

  const sendTest = async () => {
    setSending(true)
    setSendResult("")
    try {
      const res = await fetch("/api/tools/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          to: testTo,
          message: testBody,
        }),
      })
      const data = await res.json()
      setSendResult(res.ok ? "Message sent" : data?.error || "Failed")
    } catch (e: any) {
      setSendResult(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Automated WhatsApp Agents</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded h-10 px-3 bg-background" value={restaurantId} onChange={(e) => onSelectRestaurant(e.target.value)}>
                <option value="">Select restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <Input placeholder="Restaurant ID" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} />
              <Input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <Input placeholder="Verify Token" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
              <Input placeholder="Business Account ID (for templates)" value={businessAccountId} onChange={(e) => setBusinessAccountId(e.target.value)} />
            </div>
            <WhatsAppIntegrationStatus
              restaurantId={restaurantId}
              phoneNumber={phoneNumber}
              phoneNumberId={""}
              accessToken={""}
              appSecret={""}
              verifyToken={verifyToken}
              isActive={Boolean(restaurantId && verifyToken)}
            />
          </CardContent>
        </Card>

          <CardHeader>
            <CardTitle>Send Test Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="To (E.164)" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            <Textarea placeholder="Message body" value={testBody} onChange={(e) => setTestBody(e.target.value)} />
            <Button onClick={sendTest} disabled={sending || !restaurantId || !testTo || !testBody}>
              {sending ? "Sending..." : "Send"}
            </Button>
            {sendResult && <div className="text-sm text-muted-foreground">{sendResult}</div>}
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select className="border rounded h-10 px-3 bg-background" value={selectedTemplate} onChange={(e) => {
              const name = e.target.value
              setSelectedTemplate(name)
              const t = templates.find((tt) => tt.name === name)
              // Count variables from components/body placeholders if available
              const body = t?.components?.find((c: any) => c.type === 'BODY')
              // Fallback: try regex {{\d+}}
              const cnt = body?.example ? (String(body.example).match(/\{\{\d+\}\}/g)?.length || 0) : 0
              setTemplateVariables(cnt)
            }}>
              <option value="">Select template</option>
              {templates.map((t) => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
            <Input placeholder="Language code (e.g., en)" value={languageCode} onChange={(e) => setLanguageCode(e.target.value)} />
            <Input placeholder={`Parameters (pipe-separated) ${templateVariables>0?`expect ${templateVariables} vars`:''}`} value={templateParams} onChange={(e) => setTemplateParams(e.target.value)} />
            <Input placeholder="To (E.164)" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
          </div>
          <Button
            onClick={async () => {
              if (!restaurantId || !selectedTemplate || !testTo) return
              const params = templateParams.split('|').map((p) => p.trim()).filter(Boolean)
              const res = await fetch('/api/tools/whatsapp/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  restaurantId,
                  to: testTo,
                  templateName: selectedTemplate,
                  languageCode,
                  parameters: params,
                })
              })
              const data = await res.json()
              setSendResult(res.ok ? 'Template sent' : data?.error || 'Failed')
            }}
            disabled={!restaurantId || !selectedTemplate || !testTo}
          >
            Send Template
          </Button>
          {sendResult && <div className="text-sm text-muted-foreground">{sendResult}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your WhatsApp Business account and manage templates. Use the integration status above to verify your webhook.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/restaurants">Manage Restaurants</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/playground">Open Playground</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
