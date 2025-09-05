import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground">
          Test and experiment with different features
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Testing</CardTitle>
          <CardDescription>Interactive testing environment</CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
    </div>
  )
}
