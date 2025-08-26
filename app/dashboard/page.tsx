"use client"

import { DashboardLayout } from "@/src/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Bot, Package, BookOpen, MessageSquare, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<{ totalLeads: number; todayLeads: number; leadsLast7Days: { date: string; count: number }[] } | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/analytics/summary")
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        if (mounted) setSummary(data)
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load analytics")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold">Content de vous revoir 👋</h1>
          <p className="text-muted-foreground">Qu'est-ce que nous créons aujourd'hui ?</p>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4"/> Créer un Agent IA</CardTitle>
              <CardDescription>Configurez votre propre agent IA personnalisé selon vos besoins</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm"><Plus className="h-4 w-4 mr-2"/>Commencer</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4"/> Créer un Produit</CardTitle>
              <CardDescription>Ajoutez et gérez vos produits avec notre interface intuitive</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm"><Plus className="h-4 w-4 mr-2"/>Ajouter</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4"/> Base de connaissances</CardTitle>
              <CardDescription>Centralisez vos documents pour alimenter l'agent IA</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm"><Plus className="h-4 w-4 mr-2"/>Importer</Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4"/> Analyse des leads</CardTitle>
              <CardDescription>
                {loading ? "Chargement..." : error ? "Erreur de chargement" : "Derniers 7 jours"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">Chargement…</div>
              ) : error ? (
                <div className="h-48 rounded-md border border-dashed flex items-center justify-center text-destructive">{error}</div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summary?.leadsLast7Days || []}>
                      <defs>
                        <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                      <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
                      <YAxis allowDecimals={false} />
                      <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleString()} />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#leadFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4"/> KPIs</CardTitle>
              <CardDescription>Résumé aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <div className="text-muted-foreground">Total leads</div>
                  <div className="text-xl font-semibold">{summary?.totalLeads ?? (loading ? "…" : 0)}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-muted-foreground">Aujourd'hui</div>
                  <div className="text-xl font-semibold">{summary?.todayLeads ?? (loading ? "…" : 0)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
