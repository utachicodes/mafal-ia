import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Store, ListTodo, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error;

  const steps = [
    {
      title: "Security Setup",
      description: "Initialize your administrative credentials and partner identity",
      icon: <UserCircle className="h-6 w-6" />,
      action: "Configure",
      link: "/dashboard/settings",
      status: "completed"
    },
    {
      title: "Initialize Entity",
      description: "Deploy your first restaurant branch to the ecosystem",
      icon: <Store className="h-6 w-6" />,
      action: "Launch Now",
      link: "/dashboard/businesses/new",
      status: "pending"
    },
    {
      title: "Knowledge Base",
      description: "Import your menu items for RAG-augmented chat grounding",
      icon: <ListTodo className="h-6 w-6" />,
      action: "Import Data",
      link: "#",
      status: "locked"
    }
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[120px] pointer-events-none" />
        <Card className="glass border-destructive/20 max-w-md p-10 space-y-6 relative z-10">
          <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto border border-destructive/20">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">System Hold</h2>
            <p className="text-muted-foreground">
              {error === 'missing_org_id' ? "Organization identity mismatch detected." : "Authentication handshake failed during onboarding."}
            </p>
          </div>
          <Button asChild variant="outline" className="w-full h-12 rounded-xl glass border-white/10 hover:bg-white/5 transition-all gap-2">
            <Link href="/onboarding">
              <RefreshCcw className="h-4 w-4" />
              Retry Handshake
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-primary mb-4 shadow-xl">
            <Sparkles className="h-4 w-4" />
            AI Activation Protocol
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-gradient mb-6">
            Welcome to Mafal-IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Synchronizing your restaurant infrastructure with the next generation of automated customer interactions.
          </p>
        </div>

        <div className="grid gap-8">
          {steps.map((step, index) => (
            <Card key={index} className={cn(
              "glass border-white/10 overflow-hidden transition-all duration-500 group relative",
              step.status === 'locked' ? "opacity-50 grayscale pointer-events-none" : "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
            )}>
              <div className={cn(
                "absolute left-0 top-0 h-full w-1.5 transition-all duration-500",
                step.status === 'completed' ? "bg-emerald-500" : step.status === 'pending' ? "bg-primary" : "bg-neutral-800"
              )} />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 shadow-2xl transition-all duration-500 group-hover:scale-110",
                    step.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      step.status === 'pending' ? "bg-primary/10 border-primary/20 text-primary animate-pulse" :
                        "bg-white/5 border-white/5 text-muted-foreground"
                  )}>
                    {step.icon}
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                      {step.status === 'completed' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                    </div>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>

                  <div className="w-full md:w-auto">
                    {step.status === 'locked' ? (
                      <div className="flex flex-col items-center gap-1 opacity-60">
                        <span className="text-[10px] font-black uppercase tracking-widest">Locked Stage</span>
                        <Button variant="ghost" disabled className="text-muted-foreground font-black">
                          03 / PHASE
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className={cn(
                        "w-full md:w-auto h-12 rounded-xl px-10 font-bold uppercase text-[10px] tracking-widest shadow-lg transition-all",
                        step.status === 'completed' ? "bg-white/5 border border-white/10 hover:bg-white/10 text-emerald-500" : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                      )}>
                        <Link href={step.link}>
                          <span>{step.status === 'completed' ? "Verify Settings" : step.action}</span>
                          <ChevronRight className="h-4 w-4 ml-2" />
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
    </div>
  )
}
