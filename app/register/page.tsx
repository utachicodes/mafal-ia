"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

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
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {step === 5 ? "Verify your number" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {step === 5 ? "Enter the code sent to your WhatsApp" : `Step ${step} of 4`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="name">Establishment Name</Label>
              <Input
                id="name"
                placeholder="e.g. Chez Fatou"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="phone">Commercial WhatsApp Number</Label>
              <Input
                id="phone"
                placeholder="e.g. 221770000000"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Include country code without +</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Age Range</Label>
                <Select value={formData.ownerAgeRange} onValueChange={(val) => handleChange("ownerAgeRange", val)}>
                  <SelectTrigger>
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="sex-m" />
                    <Label htmlFor="sex-m">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="sex-f" />
                    <Label htmlFor="sex-f">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(val) => handleChange("country", val)}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && step < 5 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                Back
              </Button>
            )}
            <Button
              className={step === 1 ? "w-full" : "ml-auto"}
              onClick={step === 5 ? verifyOtp : handleNext}
              disabled={!isStepValid() || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 5 ? "Verify & Start" : (step === 4 ? "Send Code" : "Next")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
