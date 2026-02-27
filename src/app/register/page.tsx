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

const trustedLogos = [
  { name: "Wave",         src: "/partners/wave.jpeg" },
  { name: "Orange Money", src: "/partners/orangemoney.jpeg" },
  { name: "Djamo",        src: "/partners/djamo.jpeg" },
  { name: "L'Africa Mobile", src: "/partners/lam.jpeg" },
  { name: "Yango",        src: "/partners/yango.jpeg" },
  { name: "Paps",         src: "/partners/paps.jpeg" },
  { name: "Flowbot",      src: "/partners/flowbot.jpeg" },
  { name: "Mixx",         src: "/partners/mixx.jpeg" },
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
      // TEST MODE — skip API, sign in directly with any credentials
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        redirect: false,
        email: `${formData.whatsappNumber.replace(/\D/g, "")}@mafal.ia`,
        password: formData.pin,
      });

      if (result?.error) throw new Error("Login failed");

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
      <div className="hidden lg:flex lg:w-[52%] bg-primary flex-col justify-between p-14 text-primary-foreground relative overflow-hidden">
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        {/* White logo on red */}
        <div className="relative z-10">
          <Link href="/">
            <Logo className="h-10" white />
          </Link>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            ✦ Inscription gratuite — prêt en 2 minutes
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Créer votre<br />compte
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-sm">
            Rejoignez Mafalia et automatisez vos ventes sur WhatsApp avec un assistant IA disponible 24h/24.
          </p>
          <div className="flex gap-8 pt-2">
            {[
              { value: "500+", label: "Commerces actifs" },
              { value: "98%", label: "Satisfaction" },
              { value: "24/7", label: "Support IA" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
            Partenaires de confiance
          </p>
          <div className="marquee">
            <div className="marquee-track" style={{ gap: "2.5rem" }}>
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex items-center justify-center flex-shrink-0">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={72}
                    height={24}
                    className="h-6 w-auto object-contain brightness-0 invert opacity-60"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="lg:hidden mb-10">
            <Link href="/">
              <Logo className="h-9" />
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Inscription</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Créez votre compte partenaire en quelques secondes.</p>
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

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Nom du commerce</Label>
              <Input
                placeholder="Ex: Chez Fatou"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-11 rounded-xl border-border bg-background px-4 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Numéro WhatsApp</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-border text-sm font-medium text-foreground">
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
                  className="h-11 rounded-xl border-border bg-background pl-[7rem] pr-4 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">PIN</Label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={formData.pin}
                  onChange={(e) => handleChange("pin", e.target.value)}
                  className="h-11 rounded-xl border-border bg-background px-4 text-center tracking-[0.35em] font-semibold text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">Confirmer</Label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="h-11 rounded-xl border-border bg-background px-4 text-center tracking-[0.35em] font-semibold text-sm"
                />
              </div>
            </div>

            <Button
              className="w-full h-11 mt-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              onClick={handleNext}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Inscription…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  S&apos;inscrire <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Vous avez déjà un compte ?</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link href="/auth/signin">
            <Button variant="outline" className="w-full h-11 rounded-xl border-border font-semibold text-sm hover:bg-muted transition-all">
              Se connecter
            </Button>
          </Link>

          <div className="lg:hidden mt-12 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 text-center">
              Partenaires de confiance
            </p>
            <div className="marquee">
              <div className="marquee-track" style={{ gap: "2rem" }}>
                {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                  <div key={`m-${logo.name}-${i}`} className="flex items-center justify-center flex-shrink-0">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={64}
                      height={22}
                      className="h-5 w-auto object-contain [mix-blend-mode:multiply] dark:[mix-blend-mode:screen] grayscale opacity-50"
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
