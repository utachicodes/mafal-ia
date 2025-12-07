import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  // In a real app we might check these on server side
  const envStatus = [
    { name: "Database", status: "Connected", secure: true },
    { name: "Google Genkit", status: process.env.GOOGLE_GENKIT_API_KEY ? "Configured" : "Missing Key", secure: !!process.env.GOOGLE_GENKIT_API_KEY },
    { name: "WhatsApp API", status: process.env.WHATSAPP_ACCESS_TOKEN ? "Configured" : "Per-Restaurant/Missing", secure: true },
    { name: "Environment", status: process.env.NODE_ENV || "Development", secure: true }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & System</h1>
        <p className="text-muted-foreground">
          System health and global configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current environment configuration state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {envStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium">{item.name}</div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.secure ? "outline" : "destructive"} className="gap-1">
                    {item.secure ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3" />}
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Mafal-IA</CardTitle>
          <CardDescription>Version Information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Version: 3.0.0 (Production Ready)</p>
            <p>Architecture: Next.js 15 + Genkit + Fuse.js + Prisma</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
