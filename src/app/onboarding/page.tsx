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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to Mafalia
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Get your restaurant up and running with just a few steps.
        </p>
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={index} className={`shadow-sm border-gray-200 dark:border-gray-800 ${step.status === 'locked' ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${step.status === 'locked' ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                  {step.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <p className="text-gray-500">{step.description}</p>
                </div>
                <div className="w-full md:w-auto pt-4 md:pt-0">
                  {step.status === 'locked' ? (
                    <Button variant="ghost" disabled className="w-full md:w-auto text-gray-400">
                      Coming soon
                    </Button>
                  ) : (
                    <Button asChild className="w-full md:w-auto gap-2">
                      <Link href={step.link}>
                        <span>{step.action}</span>
                        <ChevronRight className="h-4 w-4" />
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
