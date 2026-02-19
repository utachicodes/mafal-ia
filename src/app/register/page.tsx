"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Smartphone, ShieldCheck, Zap, ArrowRight, Globe, AlertCircle } from "lucide-react"
import { Logo } from "@/src/components/logo"

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
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Section: Branding */}
      <div className="hidden lg:flex flex-col justify-between p-16 w-[45%] bg-white/5 backdrop-blur-3xl border-r border-white/10 relative z-10">
        <div className="space-y-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 scale-110">
              <Logo className="h-10 w-auto" />
            </div>
            <span className="font-bold text-3xl tracking-tighter text-gradient">Mafal-IA</span>
          </Link>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl font-bold tracking-tight leading-[0.9] text-white"
            >
              Grow Your Business <br />
              <span className="text-primary italic font-light">with WhatsApp</span>
            </motion.h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
              Join hundreds of restaurants using Mafal-IA to automate orders and serve customers 24/7.
            </p>
          </div>

          <div className="grid gap-6 pt-12">
            {[
              { icon: Zap, label: "Live in Minutes", desc: "Set up your chatbot in under 5 minutes" },
              { icon: ShieldCheck, label: "Secure & Private", desc: "Your data is encrypted and protected" },
              { icon: Globe, label: "Multilingual", desc: "English, French, Arabic and more" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-xs tracking-widest">{feature.label}</div>
                  <div className="text-muted-foreground text-sm">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground text-sm font-medium tracking-tight">
          © 2026 Mafal-IA. All Rights Reserved.
        </div>
      </div>

      {/* Right Section: Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] space-y-10"
        >
          <div className="lg:hidden text-center mb-12">
            <Logo className="h-12 w-auto mx-auto" />
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Create Your Account
            </h2>
            <p className="text-muted-foreground text-lg">
              Enter your restaurant details to get started.
            </p>
          </div>

          <div className="glass border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Smartphone className="h-40 w-40" />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm border border-red-500/20 font-bold flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Restaurant Name</Label>
                <Input
                  placeholder="e.g. Mafal Grillhouse"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/50 transition-all text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp Number</Label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-white/10 text-sm font-bold text-white">
                    {formData.country === 'Senegal' ? '🇸🇳 +221' :
                      formData.country === 'Ivory Coast' ? '🇨🇮 +225' :
                        formData.country === 'Nigeria' ? '🇳🇬 +234' : '🌍'}
                  </div>
                  <Input
                    placeholder="77 000 00 00"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    className="h-14 pl-[7.5rem] bg-white/5 border-white/10 rounded-2xl pr-6 focus:ring-primary/50 transition-all text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">PIN</Label>
                  <Input
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => handleChange("pin", e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/50 transition-all text-center tracking-[0.5em] text-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm PIN</Label>
                  <Input
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/50 transition-all text-center tracking-[0.5em] text-xl font-bold"
                  />
                </div>
              </div>

              <Button
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                onClick={handleNext}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link href="/auth/signin" className="text-primary font-bold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
