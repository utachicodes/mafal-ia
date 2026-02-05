"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start automating your restaurant today.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-gray-100 dark:border-gray-800">
          <div className="h-1 w-full bg-gray-100 rounded-t-md overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "WhatsApp Contact"}
              {step === 3 && "Owner Details"}
              {step === 4 && "Location"}
              {step === 5 && "Verify your number"}
            </CardTitle>
            <CardDescription>
              {step === 5 ? "Enter the 6-digit code sent to your WhatsApp." : "Please fill in the details below."}
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
                  <Label htmlFor="name">Establishment Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Chez Fatou"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Commercial WhatsApp Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 221770000000"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">Include country code without +</p>
                </div>
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
                  <RadioGroup value={formData.ownerSex} onValueChange={(val) => handleChange("ownerSex", val)} className="flex gap-4">
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
              <div className="space-y-4">
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
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
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
            {step > 1 && step < 5 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={loading}>
                Back
              </Button>
            )}
            <Button
              className={`${step === 1 ? "w-full" : "ml-auto"}`}
              onClick={step === 5 ? verifyOtp : handleNext}
              disabled={!isStepValid() || loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (step === 5 ? "Verify & Start" : (step === 4 ? "Send Code" : "Continue"))}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
