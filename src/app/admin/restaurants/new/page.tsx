"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    cuisine: z.string().min(2, "Cuisine is required"),
    whatsappNumber: z.string().min(8, "Valid WhatsApp number required"),
    ownerName: z.string().min(2, "Owner name is required"),
    ownerEmail: z.string().email("Invalid email address"),
    ownerPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function NewRestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cuisine: "",
            whatsappNumber: "",
            ownerName: "",
            ownerEmail: "",
            ownerPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create restaurant");
            }

            toast.success("Restaurant created successfully!");
            router.push(`/admin/restaurants/${data.restaurant.id}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Onboard New Restaurant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a new restaurant profile and owner account.
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Restaurant Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurant Details</CardTitle>
                            <CardDescription>Basic information about the business</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Restaurant Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Chez Fatou"
                                        {...form.register("name")}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cuisine">Cuisine Type</Label>
                                    <Input
                                        id="cuisine"
                                        placeholder="e.g. Senegalese"
                                        {...form.register("cuisine")}
                                    />
                                    {form.formState.errors.cuisine && (
                                        <p className="text-xs text-red-500">{form.formState.errors.cuisine.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                <Input
                                    id="whatsappNumber"
                                    placeholder="e.g. +221770000000"
                                    {...form.register("whatsappNumber")}
                                />
                                <p className="text-xs text-gray-500">Includes country code, no spaces</p>
                                {form.formState.errors.whatsappNumber && (
                                    <p className="text-xs text-red-500">{form.formState.errors.whatsappNumber.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Owner Account */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Owner Account</CardTitle>
                            <CardDescription>Create login credentials for the client</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    placeholder="Full Name"
                                    {...form.register("ownerName")}
                                />
                                {form.formState.errors.ownerName && (
                                    <p className="text-xs text-red-500">{form.formState.errors.ownerName.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ownerEmail">Email Address</Label>
                                    <Input
                                        id="ownerEmail"
                                        type="email"
                                        placeholder="client@email.com"
                                        {...form.register("ownerEmail")}
                                    />
                                    {form.formState.errors.ownerEmail && (
                                        <p className="text-xs text-red-500">{form.formState.errors.ownerEmail.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerPassword">Password</Label>
                                    <Input
                                        id="ownerPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        {...form.register("ownerPassword")}
                                    />
                                    {form.formState.errors.ownerPassword && (
                                        <p className="text-xs text-red-500">{form.formState.errors.ownerPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/dashboard">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Restaurant
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
