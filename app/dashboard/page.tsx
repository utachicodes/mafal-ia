"use client"

import DashboardLayout from "@/src/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Bot, BookOpen, Package, Plus, BarChart3, ShoppingCart, Users, ArrowUpRight, Calendar, Settings, Utensils, MessageSquare, TrendingUp, Activity, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"
// Removed useRestaurants import as we're using local state instead
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define StatCard component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  trendType?: "up" | "down";
}

const StatCard = ({ title, value, icon, description, trend, trendType = "up" }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {trendType === "up" ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <Activity className="inline h-3 w-3 mr-1" />}
        {description}
      </p>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  // Use default values in case RestaurantsProvider is not available
  const [restaurants, setRestaurants] = useState([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [summary, setSummary] = useState<{ totalLeads: number; todayLeads: number; leadsLast7Days: { date: string; count: number }[] } | null>(null)
  const [orderSummary, setOrderSummary] = useState<{
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    ordersByDay: { date: string; count: number; revenue: number }[];
    categoryDistribution: { name: string; value: number }[];
  } | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

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

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/analytics/orders")
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        if (mounted) setOrderSummary(data)
      } catch (e: any) {
        if (mounted) setOrderError(e?.message || "Failed to load order analytics")
      } finally {
        if (mounted) setOrderLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Format order data for charts
  const orderData = orderSummary?.ordersByDay.map(day => ({
    name: new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }).substring(0, 3),
    orders: day.count,
    revenue: day.revenue
  })) || []

  const pieData = orderSummary?.categoryDistribution || []

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with welcome and tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Gérez votre restaurant et suivez vos performances</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!restaurantsLoading && restaurants?.length > 0 && (
              <Badge variant="outline" className="font-normal">
                <Utensils className="h-3 w-3 mr-1" />
                {restaurants[0]?.name || "Restaurant"}
              </Badge>
            )}
            <Link href="/settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Stats Overview */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {orderLoading ? (
                    <div className="h-10 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : orderError ? (
                    <div className="text-sm text-destructive">{orderError}</div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{orderSummary?.totalOrders || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                        +{orderSummary?.todayOrders || 0} aujourd'hui
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{23}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +8% depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalLeads || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +{summary?.todayLeads || 0} aujourd'hui
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenu</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {orderLoading ? (
                    <div className="h-10 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : orderError ? (
                    <div className="text-sm text-destructive">{orderError}</div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{orderSummary?.totalRevenue?.toLocaleString() || 0} CFA</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                        +{((orderSummary?.ordersByDay[6]?.revenue || 0) / (orderSummary?.totalRevenue || 1) * 100).toFixed(0)}% aujourd'hui
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Commandes récentes</CardTitle>
                  <CardDescription>Commandes des 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  {orderLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : orderError ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="text-center">
                        <p className="text-red-500 mb-2">Erreur de chargement des données</p>
                        <p className="text-sm text-muted-foreground">{orderError}</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/orders" className="text-sm text-primary flex items-center">
                    Voir toutes les commandes
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Répartition des ventes</CardTitle>
                  <CardDescription>Par catégorie de produit</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : orderError ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="text-center">
                        <p className="text-red-500 mb-2">Erreur de chargement des données</p>
                        <p className="text-sm text-muted-foreground">{orderError}</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/analytics" className="text-sm text-primary flex items-center">
                    Voir les analytiques détaillées
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Quick actions */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4"/> Assistant IA</CardTitle>
                  <CardDescription>Gérez votre assistant IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/whatsapp">Configurer</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4"/> Menu</CardTitle>
                  <CardDescription>Gérez vos produits et menus</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/restaurants">Modifier</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Réservations</CardTitle>
                  <CardDescription>Gérez les réservations clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/orders">Voir</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Gérez les commandes de vos clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="font-medium">Commandes en attente</h3>
                    <p className="text-sm text-muted-foreground">Consultez la liste complète des commandes dans la section dédiée</p>
                  </div>
                  <div className="p-4 border-t">
                    <Button asChild>
                      <Link href="/orders">Voir toutes les commandes</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques détaillées</CardTitle>
                <CardDescription>Performances et statistiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="font-medium">Rapport complet</h3>
                    <p className="text-sm text-muted-foreground">Accédez aux statistiques détaillées dans la section analytiques</p>
                  </div>
                  <div className="p-4 border-t">
                    <Button asChild>
                      <Link href="/analytics">Voir les analytiques</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
