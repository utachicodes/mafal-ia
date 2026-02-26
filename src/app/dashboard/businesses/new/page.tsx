"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Store, ArrowLeft, Loader2, Plus } from "lucide-react"
import Link from "next/link"

export default function NewBusinessPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get("name")
        const cuisine = formData.get("cuisine")
        const description = formData.get("description")
        const businessType = formData.get("businessType")

        try {
            const res = await fetch("/api/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    cuisine,
                    description,
                    businessType,
                    whatsappNumber: "221000000000",
                    menu: []
                })
            })

            if (!res.ok) throw new Error("Failed to create business")

            const data = await res.json()
            router.push(`/dashboard/businesses/${data.id}`)
        } catch (error) {
            console.error("Creation failed", error)
            alert("Failed to create business. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard/businesses">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                        Create a New Business
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Fill in the details below to set up your new restaurant.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="glass border-white/10 overflow-hidden">
                        <div className="h-1.5 w-full bg-primary/20" />
                        <CardHeader className="pt-8">
                            <div className="flex items-center gap-4 pb-2">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Store className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Business Details</CardTitle>
                                    <CardDescription>Basic information about your restaurant.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="grid gap-3">
                                <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Business Name</Label>
                                <Input name="name" id="name" placeholder="e.g. Gourmet Burger Dakar" required className="h-12 text-lg rounded-xl bg-white/5 border-white/10 focus:ring-primary/50" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="businessType" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Business Type</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="businessType" value="RESTAURANT" className="peer sr-only" defaultChecked />
                                        <div className="rounded-xl border-2 border-white/10 p-4 hover:bg-white/5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                            <span className="block font-bold">Business</span>
                                            <span className="text-xs text-muted-foreground">Menu & Dishes</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="businessType" value="RETAIL" className="peer sr-only" />
                                        <div className="rounded-xl border-2 border-white/10 p-4 hover:bg-white/5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                            <span className="block font-bold">Retail</span>
                                            <span className="text-xs text-muted-foreground">Products & Catalog</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="businessType" value="SERVICE" className="peer sr-only" />
                                        <div className="rounded-xl border-2 border-white/10 p-4 hover:bg-white/5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                            <span className="block font-bold">Service</span>
                                            <span className="text-xs text-muted-foreground">Booking & Rates</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="cuisine" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category / Tags</Label>
                                <Input name="cuisine" id="cuisine" placeholder="e.g. Fast Food, Sports, Taxi" required className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/50" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    placeholder="Briefly describe your business to help customers understand what you offer..."
                                    className="min-h-[120px] rounded-2xl bg-white/5 border-white/10 focus:ring-primary/50 resize-none p-4"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="ghost" asChild className="rounded-xl h-12 px-8">
                            <Link href="/dashboard/businesses">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-10 shadow-xl shadow-primary/20 gap-2 font-bold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    Create Business
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
