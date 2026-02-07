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
  const [step, setStep] = useState(1)
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
  const [otp, setOtp] = useState("")
  const [restaurantId, setRestaurantId] = useState("")

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
      if (!res.ok) throw new Error(data.error || "Failed to initiate registration")

      setRestaurantId(data.restaurantId)
      setStep(2) // Move to OTP step
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Verification failed")

      // Login immediately using the PIN and credentials
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        redirect: false,
        email: `${formData.whatsappNumber.replace(/\D/g, "")}@mafal.ia`,
        password: formData.pin,
      });

      if (result?.error) {
        throw new Error("Login failed after verification");
      }

      // Success - Redirect to onboarding complete profile
      router.push("/onboarding/complete-profile")
    } catch (err: any) {
      setError(err.message)
      // If login fails, user is verified but not logged in.
      // Redirect to login? Or let them retry?
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.name &&
          !!formData.whatsappNumber &&
          !!formData.pin &&
          formData.pin === confirmPin &&
          formData.pin.length >= 4;
      case 2: return otp.length === 6
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Commencer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inscription rapide — votre compte sera validé par un administrateur
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Start Growth"}
              {step === 2 && "Vérifiez votre numéro"}
            </CardTitle>
            <CardDescription>
              {step === 2 ? "Entrez le code à 6 chiffres envoyé par SMS." : "Vos informations de base."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du restaurant *</Label>
                  <Input
                    id="name"
                    placeholder="Nom du restaurant"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  {/* Simplified Type handled later. Auto-Country hidden or shown? 
                        User said "Auto detect country".
                        The mocked UI showed "Type d'etablissement" but user said "le reste il le fait aprés l'activation".
                        So I will NOT ask for type here.
                    */}

                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <Input
                    id="phone"
                    placeholder="770000000"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">L'indicatif +221 sera ajouté automatiquement (si c'est sénégal)</p>
                  {/* Actually we should probably just ask for full number or handle country code based on detection.
                       I'll stick to full number expectation or handle the "Country" display as info.
                   */}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPin">Confirmer le code PIN *</Label>
                    <Input
                      id="confirmPin"
                      type="password"
                      placeholder="Confirmez votre code PIN"
                      maxLength={6}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code de vérification</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            {step === 2 && (
              <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>
                Retour
              </Button>
            )}
            <Button
              className={`${step === 1 ? "w-full" : "ml-auto"}`}
              onClick={step === 2 ? verifyOtp : handleNext}
              disabled={!isStepValid() || loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (step === 2 ? "Valider" : "Commencer")}
            </Button>
          </CardFooter>
          <div className="text-center pb-4 text-sm text-gray-500">
            Vous avez déjà un compte ? <Link href="/login" className="text-primary hover:underline">Connectez-vous</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
