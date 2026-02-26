"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react"
import { Logo } from "@/src/components/logo"

// Partner logos - using reliable public URLs
const trustedLogos: Array<{ name: string; src: string }> = [
  {
    name: "MTN",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/MTN_Group_Logo.svg/120px-MTN_Group_Logo.svg.png",
  },
  {
    name: "Orange",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/120px-Orange_logo.svg.png",
  },
  {
    name: "Wave",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wave_logo.png/120px-Wave_logo.png",
  },
  {
    name: "Jumia",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jumia_logo.svg/120px-Jumia_logo.svg.png",
  },
  {
    name: "Flutterwave",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Flutterwave_Logo.png/120px-Flutterwave_Logo.png",
  },
  {
    name: "UBA",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/United_Bank_for_Africa_logo.svg/120px-United_Bank_for_Africa_logo.svg.png",
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    pin: "",
    country: "Senegal",
  })
  const [confirmPin, setConfirmPin] = useState("")

  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone.includes("Abidjan") || timeZone.includes("Yamoussoukro")) {
        setFormData(prev => ({ ...prev, country: "Ivory Coast" }));
      } else if (timeZone.includes("Lagos")) {
        setFormData(prev => ({ ...prev, country: "Nigeria" }));
      } else if (timeZone.includes("Dakar")) {
        setFormData(prev => ({ ...prev, country: "Senegal" }));
      }
    } catch (e) {
      console.error("Timezone detection failed", e);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    const sanitizedPhone = formData.whatsappNumber.replace(/\D/g, "")
    setFormData(prev => ({ ...prev, whatsappNumber: sanitizedPhone }))
    initiateRegistration()
  }

  const initiateRegistration = async () => {
    if (formData.pin !== confirmPin) {
      setError("Les PIN ne correspondent pas")
      return;
    }
    if (formData.pin.length < 4) {
      setError("Le PIN doit contenir au moins 4 chiffres")
      return;
    }

    setLoading(true)
    setError("")
    try {
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

      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        redirect: false,
        email: `${formData.whatsappNumber.replace(/\D/g, "")}@mafal.ia`,
        password: formData.pin,
      });

      if (result?.error) {
        throw new Error("Login failed after registration");
      }

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
    <div className="min-h-screen flex">
      {/* Left Side - Red Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Créer votre compte</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Rejoignez Mafalia et commencez à automatiser vos échanges sur WhatsApp.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium opacity-70 mb-4">La plateforme des partenaires commerciaux Mafalia</p>
          <div className="marquee">
            <div className="marquee-track" style={{ gap: "1rem" }}>
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex h-10 items-center justify-center rounded-lg bg-white/10 px-3 backdrop-blur-sm"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={80}
                    height={24}
                    className="h-5 w-auto object-contain brightness-0 invert"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3" />
      </div>

      {/* Right Side - White Background */}
      <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center p-6 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Inscription</h2>
            <p className="text-muted-foreground">Créez votre compte partenaire en quelques secondes.</p>
          </div>

          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm font-medium"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Nom du restaurant</Label>
              <Input
                placeholder="Ex: Chez Fatou"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-12 rounded-xl border-border bg-background px-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Numéro WhatsApp</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-border text-sm font-semibold text-foreground">
                  {formData.country === "Senegal"
                    ? "🇸🇳 +221"
                    : formData.country === "Ivory Coast"
                      ? "🇨🇮 +225"
                      : formData.country === "Nigeria"
                        ? "🇳🇬 +234"
                        : "🌍"}
                </div>
                <Input
                  placeholder="77 000 00 00"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="h-12 rounded-xl border-border bg-background pl-[7.25rem] pr-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">PIN</Label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={formData.pin}
                  onChange={(e) => handleChange("pin", e.target.value)}
                  className="h-12 rounded-xl border-border bg-background px-4 text-center tracking-[0.35em] font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Confirmer</Label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="h-12 rounded-xl border-border bg-background px-4 text-center tracking-[0.35em] font-semibold"
                />
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              onClick={handleNext}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Inscription...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  S&apos;inscrire <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
              Connexion
            </Link>
          </p>

          <div className="lg:hidden mt-10">
            <p className="text-xs font-medium text-muted-foreground text-center mb-4">
              La plateforme des partenaires commerciaux Mafalia
            </p>
            <div className="marquee">
              <div className="marquee-track" style={{ gap: "0.75rem" }}>
                {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                  <div
                    key={`${logo.name}-${i}`}
                    className="flex h-10 items-center justify-center rounded-lg border border-border bg-muted px-3"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={80}
                      height={24}
                      className="h-5 w-auto object-contain opacity-70"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
