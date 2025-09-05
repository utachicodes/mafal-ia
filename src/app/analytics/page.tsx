import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View your business analytics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Analytics dashboard coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
