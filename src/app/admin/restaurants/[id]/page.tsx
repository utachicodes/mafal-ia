"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Upload, Edit, MessageSquare, Settings, Play, Pause } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import ChatSimulator from "@/src/components/admin/chat-simulator";

export default function RestaurantDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { data: session } = useSession();

    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Edit Menu State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            const res = await fetch(`/api/admin/restaurants/${id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setRestaurant(data.restaurant);
        } catch (error) {
            toast.error("Failed to load restaurant");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const res = await fetch(`/api/admin/menu-items/${editingItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editingItem.name,
                    description: editingItem.description,
                    price: editingItem.price,
                    imageUrl: editingItem.imageUrl
                }),
            });

            if (!res.ok) throw new Error("Failed to update item");

            // Refresh local state
            const updatedItems = restaurant.menuItems.map((item: any) =>
                item.id === editingItem.id ? { ...item, ...editingItem } : item
            );
            setRestaurant({ ...restaurant, menuItems: updatedItems });
            setIsEditDialogOpen(false);
            toast.success("Menu item updated");
        } catch (error) {
            toast.error("Failed to update menu item");
        }
    }

    const handleDeleteMenuItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/admin/menu-items/${itemId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete item");

            const updatedItems = restaurant.menuItems.filter((item: any) => item.id !== itemId);
            setRestaurant({ ...restaurant, menuItems: updatedItems });
            toast.success("Menu item deleted");
        } catch (error) {
            toast.error("Failed to delete item");
        }
    }

    const handleStatusToggle = async () => {
        if (!restaurant) return;
        try {
            const res = await fetch(`/api/admin/restaurants/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !restaurant.isActive }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            setRestaurant({ ...restaurant, isActive: !restaurant.isActive });
            toast.success(restaurant.isActive ? "Chatbot paused" : "Chatbot activated");
        } catch (error) {
            toast.error("Failed to toggle status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Restaurant not found</h1>
                <Link href="/admin/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {restaurant.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">{restaurant.cuisine} • {restaurant.whatsappNumber}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${restaurant.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {restaurant.isActive ? "Active" : "Paused"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={restaurant.isActive ? "outline" : "default"}
                            onClick={handleStatusToggle}
                            className={restaurant.isActive ? "text-yellow-600 border-yellow-200 hover:bg-yellow-50" : "bg-green-600 hover:bg-green-700 text-white"}
                        >
                            {restaurant.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {restaurant.isActive ? "Pause Bot" : "Activate Bot"}
                        </Button>
                        <Link href={`/admin/restaurants/${id}/upload-menu`}>
                            <Button variant="secondary">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Menu
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white dark:bg-gray-900 p-1 border border-gray-200 dark:border-gray-800">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="menu">Menu Items</TabsTrigger>
                        <TabsTrigger value="configuration">Configuration</TabsTrigger>
                        <TabsTrigger value="integrations">Integrations</TabsTrigger>
                        <TabsTrigger value="logs">Chat Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Restaurant Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-gray-500">Owner</Label>
                                            <p className="font-medium">{restaurant.owner?.name || "N/A"}</p>
                                            <p className="text-sm text-gray-500">{restaurant.owner?.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500">Created By</Label>
                                            <p className="font-medium">{restaurant.createdBy?.name || "System"}</p>
                                            <p className="text-sm text-gray-500">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold">{restaurant._count?.menuItems || 0}</div>
                                            <div className="text-xs text-gray-500">Menu Items</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold">{restaurant._count?.conversations || 0}</div>
                                            <div className="text-xs text-gray-500">Conversations</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold">{restaurant._count?.orders || 0}</div>
                                            <div className="text-xs text-gray-500">Orders</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="menu">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Menu Items</h2>
                            <Link href={`/admin/restaurants/${id}/upload-menu`}>
                                <Button>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload New Menu (PDF/Image)
                                </Button>
                            </Link>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {restaurant.menuItems?.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">No menu items yet. Upload a menu to get started.</div>
                                    ) : (
                                        restaurant.menuItems?.map((item: any) => (
                                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
                                                <div className="flex gap-4 items-center">
                                                    {item.imageUrl && (
                                                        <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded object-cover border" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-sm text-gray-500 max-w-md line-clamp-1">{item.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="font-bold">{item.price.toLocaleString()} FCFA</div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingItem(item);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Menu Item</DialogTitle>
                                </DialogHeader>
                                {editingItem && (
                                    <form onSubmit={handleUpdateMenuItem} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Price (FCFA)</Label>
                                            <Input
                                                type="number"
                                                value={editingItem.price}
                                                onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={editingItem.description}
                                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Image URL</Label>
                                            <Input
                                                value={editingItem.imageUrl || ""}
                                                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {editingItem.imageUrl && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    <p className="mb-1">Preview:</p>
                                                    <img src={editingItem.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    setIsEditDialogOpen(false); // Close dialog first to avoid flicker?
                                                    handleDeleteMenuItem(editingItem.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Item
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                                <Button type="submit">Save Changes</Button>
                                            </div>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="configuration">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Configuration</CardTitle>
                                <CardDescription>Customize how the AI talks to customers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Welcome Message</Label>
                                    <Input
                                        value={restaurant.welcomeMessage}
                                        onChange={(e) => setRestaurant({ ...restaurant, welcomeMessage: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Business Hours</Label>
                                    <Input
                                        value={restaurant.businessHours}
                                        onChange={(e) => setRestaurant({ ...restaurant, businessHours: e.target.value })}
                                    />
                                </div>
                                <Button onClick={async () => {
                                    try {
                                        const res = await fetch(`/api/admin/restaurants/${id}/status`, {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                welcomeMessage: restaurant.welcomeMessage,
                                                businessHours: restaurant.businessHours
                                            })
                                        });
                                        if (res.ok) toast.success("Configuration saved");
                                    } catch (err) {
                                        toast.error("Failed to save");
                                    }
                                }}>Save Configuration</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integrations">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500/80">Third Party Integration</span>
                                    </div>
                                    <CardTitle>LAM (L'Africa Mobile)</CardTitle>
                                    <CardDescription>Generate and manage webhooks for LAM integration</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-3">
                                            <Label className="text-xs font-bold text-gray-400">YOUR LAM WEBHOOK URL</Label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 font-mono text-sm bg-white dark:bg-black/40 p-3 rounded-lg border border-gray-200 dark:border-white/10 break-all">
                                                    {typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/lam/${restaurant.id}` : `/api/webhooks/lam/${restaurant.id}`}
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/api/webhooks/lam/${restaurant.id}`;
                                                        navigator.clipboard.writeText(url);
                                                        toast.success("URL copied to clipboard");
                                                    }}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-gray-500">
                                                Provide this URL to LAM in their dashboard config or via API to receive messages.
                                            </p>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="space-y-2">
                                                <Label>LAM API Key</Label>
                                                <Input
                                                    type="password"
                                                    value={restaurant.lamApiKey || ""}
                                                    onChange={(e) => setRestaurant({ ...restaurant, lamApiKey: e.target.value })}
                                                    placeholder="tT8G3Q... (provided by user)"
                                                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>API Base URL</Label>
                                                <Input
                                                    value={restaurant.lamBaseUrl || "https://waba.lafricamobile.com"}
                                                    onChange={(e) => setRestaurant({ ...restaurant, lamBaseUrl: e.target.value })}
                                                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={async () => {
                                            try {
                                                const res = await fetch(`/api/admin/restaurants/${id}/integrations`, {
                                                    method: "PATCH",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        lamApiKey: restaurant.lamApiKey,
                                                        lamBaseUrl: restaurant.lamBaseUrl
                                                    }),
                                                });
                                                if (!res.ok) throw new Error("Update failed");
                                                toast.success("LAM settings updated");
                                            } catch (error) {
                                                toast.error("Failed to save LAM settings");
                                            }
                                        }}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                                    >
                                        Save LAM Settings
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-purple-500/20 shadow-lg shadow-purple-500/5">
                                <CardHeader>
                                    <CardTitle>AI Agent Capabilities</CardTitle>
                                    <CardDescription>Visual & Smart features for this restaurant</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 font-medium text-sm">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-purple-500 text-white">
                                                <Upload className="h-3 w-3" />
                                            </div>
                                            <span>Visual Responses (Images)</span>
                                        </div>
                                        <div className="text-xs text-purple-600 dark:text-purple-400 font-bold">ENABLED</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-cyan-500 text-white">
                                                <Settings className="h-3 w-3" />
                                            </div>
                                            <span>Vector Search (RAG)</span>
                                        </div>
                                        <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">READY</div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        AI is currently configured to automatically send images when a dish is recommended if you have uploaded them in the Menu tab.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}
