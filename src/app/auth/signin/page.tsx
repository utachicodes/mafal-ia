"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/src/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Partner logos - using reliable public URLs
const trustedLogos: Array<{ name: string; src: string }> = [
  { name: "MTN", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/MTN_Group_Logo.svg/120px-MTN_Group_Logo.svg.png" },
  { name: "Orange", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/120px-Orange_logo.svg.png" },
  { name: "Wave", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wave_logo.png/120px-Wave_logo.png" },
  { name: "Jumia", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jumia_logo.svg/120px-Jumia_logo.svg.png" },
  { name: "Flutterwave", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Flutterwave_Logo.png/120px-Flutterwave_Logo.png" },
  { name: "UBA", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/United_Bank_for_Africa_logo.svg/120px-United_Bank_for_Africa_logo.svg.png" },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(error ? "Authentication failed. Please try again." : "")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        setLoginError("Email ou mot de passe incorrect")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setLoginError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Red Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Content de vous revoir
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Connectez-vous pour accéder à votre tableau de bord et suivre vos performances.
          </p>
        </div>

        {/* Trust Section */}
        <div className="relative z-10">
          <p className="text-xs font-medium opacity-70 mb-4">
            La plateforme des partenaires commerciaux Mafalia
          </p>
          <div className="marquee">
            <div className="marquee-track" style={{ gap: '1rem' }}>
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex items-center justify-center px-3"
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

        {/* Decorative circles */}
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
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>

          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Connexion
            </h2>
            <p className="text-muted-foreground">
              Accédez à votre tableau de bord partenaire
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm font-medium"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {loginError}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Adresse email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-border bg-background px-4"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Mot de passe</label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-border bg-background px-4 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Se connecter <LogIn className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              S&apos;inscrire
            </Link>
          </p>

          {/* Mobile Trust Logos */}
          <div className="lg:hidden mt-10">
            <p className="text-xs font-medium text-muted-foreground text-center mb-4">
              La plateforme des partenaires commerciaux Mafalia
            </p>
            <div className="marquee">
              <div className="marquee-track" style={{ gap: '0.75rem' }}>
                {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                  <div
                    key={`${logo.name}-${i}`}
                    className="flex items-center justify-center px-3"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={80}
                      height={24}
                      className="h-5 w-auto object-contain [mix-blend-mode:multiply] dark:[mix-blend-mode:screen] grayscale opacity-60"
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
