import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
        <p className="text-muted-foreground">
          Complete these steps to set up your account
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Mafal-IA</CardTitle>
            <CardDescription>Let's get you set up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-medium">Step 1: Complete your profile</p>
                <p className="text-sm text-muted-foreground">Add your business information</p>
              </div>
              <button className="text-sm text-primary hover:underline">Complete</button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-medium">Step 2: Add your first restaurant</p>
                <p className="text-sm text-muted-foreground">Set up your restaurant details</p>
              </div>
              <button className="text-sm text-primary hover:underline">Add Restaurant</button>
            </div>

            <div className="flex items-center space-x-4 opacity-50">
              <div className="flex-1">
                <p className="font-medium">Step 3: Set up your menu</p>
                <p className="text-sm text-muted-foreground">Add your menu items and categories</p>
              </div>
              <span className="text-sm text-muted-foreground">Coming soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
