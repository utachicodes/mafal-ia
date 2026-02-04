"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MessageSquare, Bot, Globe, Zap, TrendingUp } from "lucide-react"
import type { Restaurant } from "@/lib/data"

import { useEffect, useState } from "react"

interface ChatAnalyticsProps {
  restaurant: Restaurant
}

interface AnalyticsData {
  totalConversations: number
  totalMessages: number
  averageResponseTime: number
  customerSatisfaction: number
  languageDistribution: { language: string; count: number; percentage: number }[]
  dailyMessages: { day: string; messages: number }[]
  topQueries: { query: string; count: number }[]
  toolUsage: { tool: string; uses: number; color: string }[]
}

export function ChatAnalytics({ restaurant }: ChatAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics/summary?restaurantId=${restaurant.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: AnalyticsData = await response.json()
        setAnalytics(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [restaurant.id])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!analytics) {
    return <div>No analytics data available.</div>
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResponseTime}s</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              15% faster than last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customerSatisfaction}/5</div>
            <Progress value={analytics.customerSatisfaction * 20} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Messages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Message Volume</CardTitle>
            <CardDescription>Messages received per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyMessages || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tool Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>AI Tool Usage</CardTitle>
            <CardDescription>Distribution of AI tools used in conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.toolUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="uses"
                >
                  {(analytics.toolUsage || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Language Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>Languages used by customers in conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(analytics.languageDistribution || []).map((lang) => (
              <div key={lang.language} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{lang.language}</Badge>
                  <span className="text-sm">{lang.count} conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={lang.percentage} className="w-20" />
                  <span className="text-sm font-medium">{lang.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Queries</CardTitle>
          <CardDescription>What customers ask about most frequently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(analytics.topQueries || []).map((query, index) => (
              <div key={query.query} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium">{query.query}</span>
                </div>
                <Badge variant="secondary">{query.count} times</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
