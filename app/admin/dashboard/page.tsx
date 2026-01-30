"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Users, Settings } from "lucide-react";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    whatsappNumber: string;
    isActive: boolean;
    _count: {
        menuItems: number;
        conversations: number;
        orders: number;
    };
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        } else if (status === "authenticated") {
            fetchRestaurants();
        }
    }, [status, router]);

    const fetchRestaurants = async () => {
        try {
            const res = await fetch("/api/admin/restaurants");
            const data = await res.json();
            setRestaurants(data.restaurants || []);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Mafalia Admin
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage restaurants and chatbots
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {session?.user?.email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Restaurants</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {restaurants.length}
                                </p>
                            </div>
                            <Users className="h-10 w-10 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Chatbots</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {restaurants.filter((r) => r.isActive).length}
                                </p>
                            </div>
                            <Settings className="h-10 w-10 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {restaurants.reduce((sum, r) => sum + (r._count?.orders || 0), 0)}
                                </p>
                            </div>
                            <Plus className="h-10 w-10 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Restaurant List */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Restaurants
                        </h2>
                        <Link href="/admin/restaurants/new">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Restaurant
                            </Button>
                        </Link>
                    </div>

                    {restaurants.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                No restaurants yet. Add your first restaurant to get started!
                            </p>
                            <Link href="/admin/restaurants/new">
                                <Button className="bg-red-500 hover:bg-red-600 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Restaurant
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {restaurants.map((restaurant) => (
                                <Link
                                    key={restaurant.id}
                                    href={`/admin/restaurants/${restaurant.id}`}
                                    className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {restaurant.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {restaurant.cuisine} • {restaurant.whatsappNumber}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                                                <span>{restaurant._count?.menuItems || 0} menu items</span>
                                                <span>{restaurant._count?.conversations || 0} conversations</span>
                                                <span>{restaurant._count?.orders || 0} orders</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${restaurant.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                    }`}
                                            >
                                                {restaurant.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
