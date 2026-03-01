import { ChatSimulator } from "@/src/components/chat-simulator"
import { BusinessService } from "@/src/lib/business-service"
import { MessageSquare, ShieldCheck, Zap, ArrowLeft, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PreviewPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessPreviewPage({ params }: PreviewPageProps) {
    const { id } = await params
    const restaurant = await BusinessService.getBusinessById(id)

    if (!restaurant) {
        notFound()
    }

    const simpleRestaurants = [{ id: restaurant.id, name: restaurant.name }]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-3 mb-1 text-muted-foreground hover:text-foreground">
                        <Link href={`/dashboard/businesses/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Chat Preview</h1>
                    <p className="text-muted-foreground">
                        Test the chatbot for <span className="font-medium text-foreground">{restaurant.name}</span>
                    </p>
                </div>
            </div>

            {/* Simulator Container */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
                <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-400/20" />
                            <div className="h-3 w-3 rounded-full bg-amber-400/20" />
                            <div className="h-3 w-3 rounded-full bg-emerald-400/20" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Chat Simulator</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Online
                    </div>
                </div>
                <div className="p-0 md:p-4 min-h-[550px] flex flex-col">
                    <ChatSimulator restaurants={simpleRestaurants} />
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        icon: Globe,
                        title: "Multilingual",
                        desc: "Seamless communication in French, English, and Arabic.",
                    },
                    {
                        icon: ShieldCheck,
                        title: "Accurate Answers",
                        desc: "Responses based strictly on your menu data — no hallucinations.",
                    },
                    {
                        icon: Zap,
                        title: "Instant Replies",
                        desc: "Fast responses so your customers never have to wait.",
                    }
                ].map((feature, i) => (
                    <div key={i} className="p-5 rounded-xl border border-border bg-card">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                            <feature.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Go Live CTA */}
            <div className="p-6 rounded-xl bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <MessageSquare className="h-8 w-8" />
                    <div>
                        <h4 className="font-semibold text-lg">Ready to Go Live?</h4>
                        <p className="text-primary-foreground/70 text-sm">Connect your WhatsApp number to start receiving real customer orders.</p>
                    </div>
                </div>
                <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-lg font-medium">
                    <Link href={`/dashboard/businesses/${id}/whatsapp`}>
                        Connect WhatsApp
                    </Link>
                </Button>
            </div>
        </div>
    )
}
