"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Store, User, Smartphone } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Business Info
  const [businessName, setBusinessName] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")

  // Step 2: Demographics
  const [ageRange, setAgeRange] = useState("")
  const [sex, setSex] = useState("")
  const [country, setCountry] = useState("")

  // Step 3: OTP
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    setStep(step + 1)
  }

  const handleSendOtp = async () => {
    setIsLoading(true)
    // Simulate sending OTP via WhatsApp
    await new Promise(resolve => setTimeout(resolve, 1500))
    setOtpSent(true)
    setIsLoading(false)
  }

  const handleVerifyOtp = async () => {
    setIsLoading(true)
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create the restaurant/user account (mock)
    try {
      // Here we would actually call the backend to create the account
      // For now we just redirect
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to verify", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 relative overflow-hidden flex items-center justify-center p-4">
      {/* Enhanced animated background blobs with continuous movement */}
      <div className="blob-base blob-float blob-pulse top-[-8rem] right-[-8rem] h-[22rem] w-[22rem] bg-primary/20 animate-pulse absolute pointer-events-none" />
      <div className="blob-base blob-float-slow top-[20%] left-[-6rem] h-[18rem] w-[18rem] bg-emerald-500/15 animate-bounce absolute pointer-events-none" style={{ animationDuration: '3s' }} />
      <div className="blob-base blob-float bottom-[-10rem] right-[10%] h-[20rem] w-[20rem] bg-fuchsia-500/10 animate-pulse absolute pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-primary/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary/40 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/80 backdrop-blur-md relative z-10 animate-in fade-in zoom-in-50 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/20">
            {step === 1 && <Store className="h-6 w-6 text-primary" />}
            {step === 2 && <User className="h-6 w-6 text-primary" />}
            {step === 3 && <Smartphone className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {step === 1 && "Parlons de votre commerce"}
            {step === 2 && "Un peu plus sur vous"}
            {step === 3 && "Vérification WhatsApp"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/90">
            {step === 1 && "Commencez par nous donner les informations de base."}
            {step === 2 && "Ces informations nous aident à personnaliser votre expérience."}
            {step === 3 && "Nous avons envoyé un code sur votre WhatsApp."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nom commercial de l'établissement</Label>
                <Input
                  id="businessName"
                  placeholder="Ex: Restaurant Chez Fatou"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-background/50 border-input/50 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Numéro WhatsApp Commercial</Label>
                <div className="flex">
                  <div className="bg-muted/50 px-3 py-2 border border-r-0 border-input/50 rounded-l-md text-sm flex items-center text-muted-foreground">
                    +221
                  </div>
                  <Input
                    id="whatsapp"
                    placeholder="77 000 00 00"
                    className="rounded-l-none bg-background/50 border-input/50 focus:bg-background transition-colors"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">C'est sur ce numéro que l'IA répondra à vos clients.</p>
              </div>
            </div>
          )}

          {/* Step 2: Demographics */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label>Tranche d'âge</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger className="bg-background/50 border-input/50 focus:bg-background transition-colors">
                    <SelectValue placeholder="Sélectionnez votre âge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18 - 25 ans</SelectItem>
                    <SelectItem value="26-35">26 - 35 ans</SelectItem>
                    <SelectItem value="36-50">36 - 50 ans</SelectItem>
                    <SelectItem value="50+">50 ans et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sexe</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={sex === "homme" ? "default" : "outline"}
                    onClick={() => setSex("homme")}
                    className={sex === "homme" ? "shadow-md" : "bg-background/50 border-input/50 hover:bg-background/80"}
                  >
                    Homme
                  </Button>
                  <Button
                    type="button"
                    variant={sex === "femme" ? "default" : "outline"}
                    onClick={() => setSex("femme")}
                    className={sex === "femme" ? "shadow-md" : "bg-background/50 border-input/50 hover:bg-background/80"}
                  >
                    Femme
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pays</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-background/50 border-input/50 focus:bg-background transition-colors">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sn">Sénégal</SelectItem>
                    <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                    <SelectItem value="ng">Nigeria</SelectItem>
                    <SelectItem value="ma">Maroc</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: OTP */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {!otpSent ? (
                <div className="text-center py-4">
                  <Smartphone className="h-16 w-16 text-primary mx-auto mb-4 opacity-20" />
                  <p className="mb-4">
                    Nous allons envoyer un code de vérification au
                    <span className="font-bold block text-lg">{whatsappNumber ? `+221 ${whatsappNumber}` : "votre numéro"}</span>
                  </p>
                  <Button onClick={handleSendOtp} disabled={isLoading} className="w-full shadow-lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Envoyer le code par WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Entrez le code à 4 chiffres reçu sur WhatsApp</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Input
                      className="text-center text-2xl tracking-widest h-14 w-48 font-mono bg-background/50 border-input/50 focus:bg-background transition-colors"
                      maxLength={4}
                      placeholder="0000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} disabled={otp.length !== 4 || isLoading} className="w-full mt-4 shadow-lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Valider et terminer
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary" onClick={() => setOtpSent(false)}>
                    Changer de numéro ou renvoyer
                  </Button>
                </div>
              )}
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/10 p-6 bg-muted/10 backdrop-blur-sm">
          {step > 1 && step < 3 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={isLoading} className="hover:bg-background/50">
              Retour
            </Button>
          )}

          {step === 1 && (
            <div className="ml-auto">
              <Button onClick={handleNext} disabled={!businessName || !whatsappNumber || isLoading} className="shadow-md">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suivant
              </Button>
            </div>
          )}

          {step === 2 && (
            <Button className="ml-auto shadow-md" onClick={handleNext} disabled={!ageRange || !sex || !country || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuer
            </Button>
          )}

          {step === 1 && (
            <Button variant="ghost" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => router.push("/")}>
              Annuler
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
