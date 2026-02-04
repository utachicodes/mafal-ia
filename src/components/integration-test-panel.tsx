"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Play, CheckCircle, XCircle, Clock, Zap } from "lucide-react"
import { TestUtils } from "@/src/lib/test-utils"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  duration?: number
  error?: string
}

export function IntegrationTestPanel() {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testMessage, setTestMessage] = useState("Hello, what's on your menu?")

  const tests = [
    {
      name: "Restaurant Data Validation",
      test: async () => {
        const mockRestaurant = TestUtils.createMockRestaurant()
        if (!TestUtils.validateRestaurant(mockRestaurant)) {
          throw new Error("Restaurant validation failed")
        }
      },
    },
    {
      name: "Menu Item Validation",
      test: async () => {
        const mockRestaurant = TestUtils.createMockRestaurant()
        for (const item of mockRestaurant.menu) {
          if (!TestUtils.validateMenuItem(item)) {
            throw new Error(`Menu item validation failed: ${item.name}`)
          }
        }
      },
    },
    {
      name: "AI Response Generation",
      test: async () => {
        const mockRestaurant = TestUtils.createMockRestaurant()
        const response = await TestUtils.testAIResponse(testMessage, mockRestaurant)
        if (!response.response || !response.detectedLanguage) {
          throw new Error("AI response validation failed")
        }
      },
    },
    {
      name: "WhatsApp Message Processing",
      test: async () => {
        const mockMessage = TestUtils.createMockWhatsAppMessage(testMessage)
        if (!mockMessage.entry || !mockMessage.entry[0].changes) {
          throw new Error("WhatsApp message structure validation failed")
        }
      },
    },
    {
      name: "Webhook Signature Validation",
      test: async () => {
        const isValid = TestUtils.testWebhookSignature("test payload", "sha256=test", "secret")
        if (!isValid) {
          throw new Error("Webhook signature validation failed")
        }
      },
    },
  ]

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const results: TestResult[] = tests.map((test) => ({
      name: test.name,
      status: "pending",
    }))

    setTestResults([...results])

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      results[i].status = "running"
      setTestResults([...results])

      try {
        const { duration } = await TestUtils.measureResponseTime(test.test)
        results[i].status = "success"
        results[i].duration = duration
      } catch (error) {
        results[i].status = "error"
        results[i].error = error instanceof Error ? error.message : "Unknown error"
      }

      setTestResults([...results])
      await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay for UX
    }

    setIsRunning(false)

    const successCount = results.filter((r) => r.status === "success").length
    const totalCount = results.length

    toast({
      title: "Tests completed",
      description: `${successCount}/${totalCount} tests passed`,
      variant: successCount === totalCount ? "default" : "destructive",
    })
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Passed
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "running":
        return <Badge variant="secondary">Running</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const successCount = testResults.filter((r) => r.status === "success").length
  const errorCount = testResults.filter((r) => r.status === "error").length
  const progress = testResults.length > 0 ? ((successCount + errorCount) / testResults.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Integration Tests
        </CardTitle>
        <CardDescription>Run automated tests to verify platform functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Message</label>
          <Textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message for AI response testing"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={runTests} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>

          {testResults.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {successCount} passed, {errorCount} failed
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Progress: {Math.round(progress)}% ({successCount + errorCount}/{testResults.length})
            </p>
          </div>
        )}

        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <p className="font-medium">{result.name}</p>
                  {result.error && <p className="text-sm text-red-500">{result.error}</p>}
                  {result.duration && <p className="text-sm text-muted-foreground">{result.duration.toFixed(2)}ms</p>}
                </div>
              </div>
              {getStatusBadge(result.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
