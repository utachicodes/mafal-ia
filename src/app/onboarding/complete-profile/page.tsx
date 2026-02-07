"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export default function CompleteProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        ownerAgeRange: "",
        ownerSex: "",
        activitySector: "",
    })

    // We assume user is logged in now.
    // If not, we might bounce them to login, but let's hope the previous flow worked.

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to save details");

            router.push("/dashboard");
        } catch (e) {
            console.error(e);
            // Error handling?
        } finally {
            setLoading(false);
        }
    }

    const isValid = formData.ownerAgeRange && formData.ownerSex && formData.activitySector;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Encore une étape...
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Aidez-nous à personnaliser votre expérience.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil du gérant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tranche d'âge</Label>
                            <Select value={formData.ownerAgeRange} onValueChange={(val) => handleChange("ownerAgeRange", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="18-25">18 - 25 ans</SelectItem>
                                    <SelectItem value="26-35">26 - 35 ans</SelectItem>
                                    <SelectItem value="36-45">36 - 45 ans</SelectItem>
                                    <SelectItem value="46+">46+ ans</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Sexe</Label>
                            <RadioGroup value={formData.ownerSex} onValueChange={(val) => handleChange("ownerSex", val)} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="M" id="sex-m" />
                                    <Label htmlFor="sex-m">Homme</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="F" id="sex-f" />
                                    <Label htmlFor="sex-f">Femme</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Secteur d'activité</Label>
                            <Select value={formData.activitySector} onValueChange={(val) => handleChange("activitySector", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fast Food">Fast Food</SelectItem>
                                    <SelectItem value="Restaurant">Restaurant (Service à table)</SelectItem>
                                    <SelectItem value="Boulangerie">Boulangerie / Pâtisserie</SelectItem>
                                    <SelectItem value="Traiteur">Traiteur</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubmit} disabled={!isValid || loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Terminer l'inscription"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
