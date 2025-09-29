"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, MessageCircle, Brain, Wallet, LineChart, Bot } from "lucide-react"

export default function ToolsPage() {
  const tools = [
    {
      key: "whatsapp",
      title: "Automated WhatsApp Agents",
      desc: "Engage with customers using an intelligent WhatsApp agent.",
      href: "/dashboard/tools/whatsapp",
      icon: MessageCircle,
      status: "available" as const,
    },
    {
      key: "rag",
      title: "Knowledge RAG",
      desc: "Index your docs and chat with your knowledge base.",
      href: "/dashboard/tools/rag",
      icon: Brain,
      status: "available" as const,
    },
    { key: "treasury", title: "Treasury Pilot", desc: "Predictive cash flow insights.", href: "#", icon: Wallet, status: "soon" as const },
    { key: "insights", title: "AI-Powered Insights", desc: "Deep business intelligence.", href: "#", icon: LineChart, status: "soon" as const },
    { key: "agent", title: "Commercial Assistant", desc: "Lead qualification & analytics.", href: "#", icon: Bot, status: "soon" as const },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tools</h1>
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" />
          A suite of AI tools for business
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map((t) => {
          const Icon = t.icon
          return (
            <Card
              key={t.key}
              className="transition-all hover:shadow-xl hover:-translate-y-0.5 border border-muted/60 hover:border-primary/40 hover:ring-1 hover:ring-primary/30"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" /> {t.title}
                </CardTitle>
                {t.status === "soon" ? (
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Coming soon</span>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                {t.status === "available" ? (
                  <Button asChild>
                    <Link href={t.href}>Open</Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>Not available</Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
