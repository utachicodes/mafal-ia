"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MessageSquare, Bot, Globe, Zap, TrendingUp } from "lucide-react"
import type { Restaurant } from "@/lib/data"

interface ChatAnalyticsProps {
  restaurant: Restaurant
}

// Mock analytics data (in production, this would come from a database)
const mockAnalytics = {
  totalConversations: 156,
  totalMessages: 1247,
  averageResponseTime: 1.2,
  customerSatisfaction: 4.6,
  languageDistribution: [
    { language: "French", count: 89, percentage: 57 },
    { language: "English", count: 45, percentage: 29 },
    { language: "Wolof", count: 22, percentage: 14 },
  ],
  dailyMessages: [
    { day: "Mon", messages: 45 },
    { day: "Tue", messages: 52 },
    { day: "Wed", messages: 38 },
    { day: "Thu", messages: 61 },
    { day: "Fri", messages: 73 },
    { day: "Sat", messages: 89 },
    { day: "Sun", messages: 67 },
  ],
  topQueries: [
    { query: "Menu information", count: 234 },
    { query: "Order placement", count: 189 },
    { query: "Opening hours", count: 156 },
    { query: "Pricing", count: 134 },
    { query: "Location", count: 98 },
  ],
  toolUsage: [
    { tool: "Menu Information", uses: 345, color: "#8884d8" },
    { tool: "Order Calculator", uses: 234, color: "#82ca9d" },
    { tool: "General Response", uses: 456, color: "#ffc658" },
  ],
}

export function ChatAnalytics({ restaurant }: ChatAnalyticsProps) {
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
            <div className="text-2xl font-bold">{mockAnalytics.totalConversations}</div>
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
            <div className="text-2xl font-bold">{mockAnalytics.totalMessages}</div>
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
            <div className="text-2xl font-bold">{mockAnalytics.averageResponseTime}s</div>
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
            <div className="text-2xl font-bold">{mockAnalytics.customerSatisfaction}/5</div>
            <Progress value={mockAnalytics.customerSatisfaction * 20} className="mt-2" />
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
              <BarChart data={mockAnalytics.dailyMessages}>
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
                  data={mockAnalytics.toolUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="uses"
                >
                  {mockAnalytics.toolUsage.map((entry, index) => (
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
            {mockAnalytics.languageDistribution.map((lang) => (
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
            {mockAnalytics.topQueries.map((query, index) => (
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
