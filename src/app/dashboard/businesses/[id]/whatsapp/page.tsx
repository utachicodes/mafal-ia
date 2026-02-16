import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    ArrowLeft,
    Webhook,
    ShieldCheck,
    Smartphone,
    Copy,
    RefreshCw
} from "lucide-react"
import Link from "next/link"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { notFound } from "next/navigation"

interface BusinessWhatsAppPageProps {
    params: { id: string }
}

export const dynamic = "force-dynamic"

export default async function BusinessWhatsAppPage({ params }: BusinessWhatsAppPageProps) {
    const { id } = await params
    const restaurant = await RestaurantService.getRestaurantById(id)

    if (!restaurant) {
        notFound()
    }

    const webhookUrl = `http://localhost:3005/api/whatsapp?restaurantId=${id}`

    return (
        <div className="space-y-8 py-2 h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="space-y-1">
                    <Button variant="ghost" asChild className="-ml-2 mb-2 text-muted-foreground hover:text-foreground">
                        <Link href={`/dashboard/businesses/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Business
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        WhatsApp Integration
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Connect <span className="font-semibold text-gray-900 dark:text-white">{restaurant.name}</span> to the WhatsApp Business API.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Webhook Configuration */}
                <Card className="shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
                                <Webhook className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Webhook URL</CardTitle>
                                <CardDescription>Configure this URL in your Meta Developer Portal.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-xs break-all flex justify-between items-center group border border-gray-100 dark:border-gray-800">
                            <span className="text-gray-600 dark:text-gray-400">{webhookUrl}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                            <span>Verify Token: <strong>mafalia_secret_token</strong></span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-3">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                            <RefreshCw className="h-3 w-3" />
                            Generate New Webhook
                        </Button>
                    </CardFooter>
                </Card>

                {/* Integration Status */}
                <Card className="shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Connection Status</CardTitle>
                                <CardDescription>WhatsApp Business API connectivity.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                            <Smartphone className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-900 dark:text-white">Not Connected</p>
                            <p className="text-sm text-gray-500">Your WhatsApp number is not yet linked.</p>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            Connect Number
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Guide Section */}
            <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30">
                <h3 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5" />
                    Quick Instructions
                </h3>
                <ul className="text-sm text-amber-800/80 dark:text-amber-500/80 space-y-2 list-disc list-inside">
                    <li>Register on the Meta for Developers portal.</li>
                    <li>Add the WhatsApp product to your application.</li>
                    <li>Paste the Webhook URL above into the 'Configuration' section.</li>
                    <li>Subscribe to 'messages' in the Webhook fields.</li>
                </ul>
            </div>
        </div>
    )
}
