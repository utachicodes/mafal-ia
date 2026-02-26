"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
        } finally {
            setLoading(false);
        }
    }

    const isValid = formData.ownerAgeRange && formData.ownerSex && formData.activitySector;

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-8 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gradient">
                        Une dernière étape...
                    </h2>
                    <p className="text-muted-foreground">
                        Aidez-nous à personnaliser votre expérience.
                    </p>
                </div>

                <Card className="glass border-white/10 shadow-2xl">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-xl">Profil du gérant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tranche d'âge</Label>
                            <Select value={formData.ownerAgeRange} onValueChange={(val) => handleChange("ownerAgeRange", val)}>
                                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    <SelectItem value="18-25">18 - 25 ans</SelectItem>
                                    <SelectItem value="26-35">26 - 35 ans</SelectItem>
                                    <SelectItem value="36-45">36 - 45 ans</SelectItem>
                                    <SelectItem value="46+">46+ ans</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sexe</Label>
                            <RadioGroup value={formData.ownerSex} onValueChange={(val) => handleChange("ownerSex", val)} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="M" id="sex-m" className="border-white/20 text-primary" />
                                    <Label htmlFor="sex-m">Homme</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="F" id="sex-f" className="border-white/20 text-primary" />
                                    <Label htmlFor="sex-f">Femme</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Secteur d'activité</Label>
                            <Select value={formData.activitySector} onValueChange={(val) => handleChange("activitySector", val)}>
                                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    <SelectItem value="Fast Food">Fast Food</SelectItem>
                                    <SelectItem value="Business">Restaurant (Service à table)</SelectItem>
                                    <SelectItem value="Boulangerie">Boulangerie / Pâtisserie</SelectItem>
                                    <SelectItem value="Traiteur">Traiteur</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-white/5 pt-6">
                        <Button
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            onClick={handleSubmit}
                            disabled={!isValid || loading}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Enregistrement...</>
                            ) : (
                                "Terminer l'inscription"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
