"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/src/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const partnerLogos = [
  { name: "Wave",        src: "/partners/wave.jpeg" },
  { name: "Orange Money",src: "/partners/orangemoney.jpeg" },
  { name: "Djamo",       src: "/partners/djamo.jpeg" },
  { name: "L'Africa Mobile", src: "/partners/lam.jpeg" },
  { name: "Yango",       src: "/partners/yango.jpeg" },
  { name: "Paps",        src: "/partners/paps.jpeg" },
  { name: "Flowbot",     src: "/partners/flowbot.jpeg" },
  { name: "Mixx",        src: "/partners/mixx.jpeg" },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [loginError, setLoginError] = useState(error ? "Authentication failed. Please try again." : "")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")
    try {
      const result = await signIn("credentials", { email, password, redirect: false, callbackUrl })
      if (result?.error) {
        setLoginError("Email ou mot de passe incorrect")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setLoginError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left panel (desktop) ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-primary flex-col justify-between p-14 relative overflow-hidden">

        {/* background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        {/* Logo — white on red */}
        <div className="relative z-10">
          <Link href="/">
            <Logo className="h-10" white />
          </Link>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            ✦ Plateforme IA pour commerces africains
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Content de<br />vous revoir
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-sm">
            Connectez-vous pour accéder à votre tableau de bord, suivre vos commandes et analyser vos performances.
          </p>

          {/* Stats row */}
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

        {/* Partner logos */}
        <div className="relative z-10 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
            Partenaires de confiance
          </p>
          <div className="marquee">
            <div className="marquee-track" style={{ gap: "0.75rem" }}>
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex h-10 w-28 items-center justify-center rounded-lg bg-white/90 px-3 flex-shrink-0"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={80}
                    height={28}
                    className="h-6 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ───────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/">
              <Logo className="h-9" />
            </Link>
          </div>

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Connexion</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Accédez à votre tableau de bord partenaire
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 rounded-xl border-border bg-background text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Mot de passe</label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-11 rounded-xl border-border bg-background text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 mt-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connexion en cours…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter <LogIn className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Vous n'avez pas de compte ?</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link href="/register">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-border font-semibold text-sm hover:bg-muted transition-all"
            >
              Créer un compte
            </Button>
          </Link>

          {/* Mobile partner logos */}
          <div className="lg:hidden mt-12 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 text-center">
              Partenaires de confiance
            </p>
            <div className="marquee">
              <div className="marquee-track" style={{ gap: "2rem" }}>
                {[...partnerLogos, ...partnerLogos].map((logo, i) => (
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
