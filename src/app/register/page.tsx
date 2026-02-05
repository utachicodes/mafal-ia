"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    ownerAgeRange: "",
    ownerSex: "",
    country: "",
  })
  const [otp, setOtp] = useState("")
  const [restaurantId, setRestaurantId] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Sanitize phone number: remove non-digits
      const sanitizedPhone = formData.whatsappNumber.replace(/\D/g, "")
      setFormData(prev => ({ ...prev, whatsappNumber: sanitizedPhone }))
      initiateRegistration()
    }
  }

  const initiateRegistration = async () => {
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
      setStep(5) // Move to OTP step
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

      // Success - Redirect to dashboard or onboarding
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.name
      case 2: return !!formData.whatsappNumber
      case 3: return !!formData.ownerAgeRange && !!formData.ownerSex
      case 4: return !!formData.country
      case 5: return otp.length === 6
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav / Logo */}
      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo className="h-10" />
        </Link>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Step {step} of 5
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md mx-auto glass border-white/20 dark:border-white/10 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500 rounded-3xl overflow-hidden">
          <div className="h-2 w-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <CardHeader className="space-y-4 pb-8 pt-10 px-8">
            <CardTitle className="text-3xl font-black tracking-tighter text-center text-gradient">
              {step === 5 ? "Verify your number" : "Join Mafal-IA"}
            </CardTitle>
            <CardDescription className="text-center text-base font-medium">
              {step === 5 ? "We've sent a 6-digit code to your WhatsApp" : "Transform your restaurant with intelligent automation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-10">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-2xl text-sm border border-destructive/20 text-center animate-in slide-in-from-top-2 font-bold">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Establishment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Chez Fatou"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Commercial WhatsApp Number</Label>
                <Input
                  id="phone"
                  placeholder="e.g. 221770000000"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground ml-1">Include country code without +</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Age Range</Label>
                  <Select value={formData.ownerAgeRange} onValueChange={(val) => handleChange("ownerAgeRange", val)}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="18-25">18 - 25</SelectItem>
                      <SelectItem value="26-35">26 - 35</SelectItem>
                      <SelectItem value="36-45">36 - 45</SelectItem>
                      <SelectItem value="46+">46+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Sex</Label>
                  <RadioGroup value={formData.ownerSex} onValueChange={(val) => handleChange("ownerSex", val)} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border/10 hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="M" id="sex-m" className="text-primary border-primary/50" />
                      <Label htmlFor="sex-m" className="cursor-pointer font-bold">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border/10 hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="F" id="sex-f" className="text-primary border-primary/50" />
                      <Label htmlFor="sex-f" className="cursor-pointer font-bold">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="country" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Country</Label>
                <Select value={formData.country} onValueChange={(val) => handleChange("country", val)}>
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="Senegal">Senegal</SelectItem>
                    <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="otp" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Verification Code</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-2xl font-black tracking-[0.5em] bg-white/50 dark:bg-black/20 border-border/10 h-16 rounded-xl focus:ring-primary/20"
                  autoFocus
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              {step > 1 && step < 5 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={loading} className="rounded-full px-6 font-bold hover:bg-primary/5">
                  Back
                </Button>
              )}
              <Button
                className={`${step === 1 ? "w-full" : "ml-auto"} rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold px-8 py-6 h-auto text-lg bg-primary hover:bg-primary/90`}
                onClick={step === 5 ? verifyOtp : handleNext}
                disabled={!isStepValid() || loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (step === 5 ? "Verify & Start" : (step === 4 ? "Send Code" : "Continue"))}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
