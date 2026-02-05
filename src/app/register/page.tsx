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
      initiateRegistration()
    }
  }

  const initiateRegistration = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 relative overflow-hidden flex flex-col">
      {/* Background Blobs */}
      {/* Background Blobs - Removed per user request */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-background" />

      {/* Nav / Logo */}
      <nav className="relative z-10 p-6">
        <Link href="/">
          <Logo className="h-12" />
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {step === 5 ? "Verify your number" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 5 ? "Enter the code sent to your WhatsApp" : `Step ${step} of 4`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20 text-center">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="name">Establishment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Chez Fatou"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-background/50"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="phone">Commercial WhatsApp Number</Label>
                <Input
                  id="phone"
                  placeholder="e.g. 221770000000"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="bg-background/50"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">Include country code without +</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <Select value={formData.ownerAgeRange} onValueChange={(val) => handleChange("ownerAgeRange", val)}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18 - 25</SelectItem>
                      <SelectItem value="26-35">26 - 35</SelectItem>
                      <SelectItem value="36-45">36 - 45</SelectItem>
                      <SelectItem value="46+">46+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <RadioGroup value={formData.ownerSex} onValueChange={(val) => handleChange("ownerSex", val)}>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="M" id="sex-m" />
                      <Label htmlFor="sex-m" className="cursor-pointer flex-1">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="F" id="sex-f" />
                      <Label htmlFor="sex-f" className="cursor-pointer flex-1">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(val) => handleChange("country", val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senegal">Senegal</SelectItem>
                    <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-300">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg tracking-widest bg-background/50"
                  autoFocus
                />
              </div>
            )}

            <div className="flex justify-between pt-2">
              {step > 1 && step < 5 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={loading}>
                  Back
                </Button>
              )}
              <Button
                className={step === 1 ? "w-full shadow-lg" : "ml-auto shadow-lg"}
                onClick={step === 5 ? verifyOtp : handleNext}
                disabled={!isStepValid() || loading}
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 5 ? "Verify & Start" : (step === 4 ? "Send Code" : "Next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
