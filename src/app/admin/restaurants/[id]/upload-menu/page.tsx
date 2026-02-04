"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Image, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UploadMenuPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [extractedItems, setExtractedItems] = useState<any[]>([]);
    const [step, setStep] = useState<"upload" | "review" | "complete">("upload");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`/api/admin/restaurants/${id}/upload-menu`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setExtractedItems(data.items || []);
            setStep("review");
            toast.success(`Extracted ${data.items?.length || 0} menu items!`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveItems = async () => {
        setUploading(true);
        try {
            const res = await fetch(`/api/admin/restaurants/${id}/menu-items/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: extractedItems }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save items");
            }

            setStep("complete");
            toast.success("Menu items saved successfully!");

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(`/admin/restaurants/${id}`);
            }, 2000);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updated = [...extractedItems];
        updated[index] = { ...updated[index], [field]: value };
        setExtractedItems(updated);
    };

    const handleRemoveItem = (index: number) => {
        setExtractedItems(extractedItems.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={`/admin/restaurants/${id}`}
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Restaurant
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Upload Menu
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload a PDF or image of your menu, and our AI will extract the items.
                    </p>
                </div>

                {/* Upload Step */}
                {step === "upload" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Menu Document</CardTitle>
                            <CardDescription>Supported formats: PDF, PNG, JPG, JPEG</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                                <input
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {file ? (
                                        <>
                                            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                PDF, PNG, JPG up to 10MB
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link href={`/admin/restaurants/${id}`}>
                                    <Button variant="outline">Cancel</Button>
                                </Link>
                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {uploading ? "Processing..." : "Extract Menu Items"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Review Step */}
                {step === "review" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Review Extracted Items ({extractedItems.length})</CardTitle>
                                <CardDescription>
                                    Edit any items before saving to the menu
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {extractedItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500">Name</label>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Price (FCFA)</label>
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, "price", parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Description</label>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Category</label>
                                                <input
                                                    type="text"
                                                    value={item.category || ""}
                                                    onChange={(e) => handleItemChange(index, "category", e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    placeholder="e.g. Entrées, Plats..."
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(index)}
                                                className="ml-4 text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setStep("upload")}>
                                Upload Again
                            </Button>
                            <Button
                                onClick={handleSaveItems}
                                disabled={uploading || extractedItems.length === 0}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save {extractedItems.length} Items to Menu
                            </Button>
                        </div>
                    </div>
                )}

                {/* Complete Step */}
                {step === "complete" && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Menu Uploaded Successfully!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {extractedItems.length} items have been added to the menu.
                            </p>
                            <p className="text-sm text-gray-500">Redirecting...</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
