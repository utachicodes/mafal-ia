"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Logo } from "@/src/components/logo"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    pin: "",
    country: "Senegal", // Default
  })
  const [confirmPin, setConfirmPin] = useState("")

  // Auto-detect country on mount
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone.includes("Abidjan") || timeZone.includes("Yamoussoukro")) {
        setFormData(prev => ({ ...prev, country: "Ivory Coast" }));
      } else if (timeZone.includes("Lagos")) {
        setFormData(prev => ({ ...prev, country: "Nigeria" }));
      } else if (timeZone.includes("Dakar")) {
        setFormData(prev => ({ ...prev, country: "Senegal" }));
      } else {
        // Keep default or set to Other
        // setFormData(prev => ({ ...prev, country: "Other" }));
      }
    } catch (e) {
      console.error("Timezone detection failed", e);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    // Sanitize phone number: remove non-digits
    const sanitizedPhone = formData.whatsappNumber.replace(/\D/g, "")
    setFormData(prev => ({ ...prev, whatsappNumber: sanitizedPhone }))
    initiateRegistration()
  }

  const initiateRegistration = async () => {
    if (formData.pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    if (formData.pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    setLoading(true)
    setError("")
    try {
      // Final sanitization check before sending
      const payload = {
        ...formData,
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, "")
      }
      const res = await fetch("/api/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create account")

      // Account created successfully - now login
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        redirect: false,
        email: `${formData.whatsappNumber.replace(/\D/g, "")}@mafal.ia`,
        password: formData.pin,
      });

      if (result?.error) {
        throw new Error("Login failed after registration");
      }

      // Success - Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.name && formData.whatsappNumber && formData.pin && confirmPin
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Container for perfect centering */}
      <div className="w-full max-w-md space-y-8">

        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity mb-6">
            <Logo className="h-12 w-auto" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
            Commencer
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Inscription rapide — votre compte sera validé par un administrateur
          </p>
        </div>

        <Card className="glass border-white/20 dark:border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Start Growth</CardTitle>
            <CardDescription>Vos informations de base.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du restaurant *</Label>
                <Input
                  id="name"
                  placeholder="Nom du restaurant"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  autoFocus
                  className="bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone *</Label>
                <Input
                  id="phone"
                  placeholder="770000000"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="bg-transparent"
                />
                <p className="text-xs text-muted-foreground">L'indicatif +221 sera ajouté automatiquement (si c'est sénégal)</p>
                {formData.country && <p className="text-xs text-green-600">Pays détecté: {formData.country}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Code PIN *</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="...."
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => handleChange("pin", e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPin">Confirmer le code PIN *</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    placeholder="Confirmez"
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-6">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleNext}
              disabled={!isFormValid() || loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
            </Button>
          </CardFooter>
          <div className="text-center pb-6 text-sm text-muted-foreground">
            Vous avez déjà un compte ? <Link href="/login" className="text-primary hover:underline font-medium">Connectez-vous</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
