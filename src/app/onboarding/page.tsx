import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Store, ListTodo, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error;

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 px-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">Configuration Error</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300 mt-1">
            {error === 'missing_org_id' && "Organization details could not be found. Please check your account settings."}
            {error === 'permissions' && "You don't have permission to perform this action."}
            {!['missing_org_id', 'permissions'].includes(error) && "Something went wrong loading your onboarding progress. Please try refreshing the page."}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/onboarding">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    {
      title: "Complete your profile",
      description: "Add your business information and contact details",
      icon: <UserCircle className="h-6 w-6" />,
      action: "Complete",
      link: "/settings",
      status: "completed" // Simulated completed state
    },
    {
      title: "Add your first business",
      description: "Set up your business details and location",
      icon: <Store className="h-6 w-6" />,
      action: "Add Business",
      link: "/dashboard/businesses/new",
      status: "pending"
    },
    {
      title: "Set up your menu",
      description: "Add your menu items and categories to start taking orders",
      icon: <ListTodo className="h-6 w-6" />,
      action: "Start Menu",
      link: "#",
      status: "locked"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-4 animate-in fade-in zoom-in duration-500">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
          Welcome to Mafalia
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Get your business up and running with just a few steps.
        </p>
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={index} className={`shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 ${step.status === 'locked' ? 'bg-gray-50 dark:bg-gray-900/50 opacity-75' : 'hover:shadow-md hover:border-red-200 dark:hover:border-red-900/30'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${step.status === 'locked' ? 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700' :
                  step.status === 'completed' ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' :
                    'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400'
                  }`}>
                  {step.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
                <div className="w-full md:w-auto pt-4 md:pt-0">
                  {step.status === 'locked' ? (
                    <Button variant="ghost" disabled className="w-full md:w-auto text-gray-400">
                      Coming soon
                    </Button>
                  ) : step.status === 'completed' ? (
                    <Button variant="outline" asChild className="w-full md:w-auto gap-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-800">
                      <Link href={step.link}>
                        Manage
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20">
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
        ))
        }
      </div>
    </div>
  )
}
