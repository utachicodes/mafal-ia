import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Store, ListTodo, ChevronRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const steps = [
    {
      title: "Complete your profile",
      description: "Add your business information and contact details",
      icon: <UserCircle className="h-6 w-6" />,
      action: "Complete",
      link: "/settings",
      status: "pending"
    },
    {
      title: "Add your first restaurant",
      description: "Set up your restaurant details and location",
      icon: <Store className="h-6 w-6" />,
      action: "Add Restaurant",
      link: "/restaurants/new",
      status: "pending"
    },
    {
      title: "Set up your menu",
      description: "Add your menu items and categories to start taking orders",
      icon: <ListTodo className="h-6 w-6" />,
      action: "Coming soon",
      link: "#",
      status: "locked"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to Mafal-IA
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're excited to have you! Complete these small steps to get your restaurant automated and ready for WhatsApp orders.
        </p>
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={index} className={`group transition-all duration-300 hover:shadow-2xl hover:border-primary/20 bg-card/50 backdrop-blur-sm ${step.status === 'locked' ? 'opacity-60' : ''}`}>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${step.status === 'locked' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                  {step.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                    {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                <div className="w-full md:w-auto pt-4 md:pt-0">
                  {step.status === 'locked' ? (
                    <span className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted rounded-full">
                      Coming soon
                    </span>
                  ) : (
                    <Button asChild className="w-full md:w-auto group/btn rounded-xl px-8 shadow-md hover:shadow-xl transition-all">
                      <Link href={step.link}>
                        <span>{step.action}</span>
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

