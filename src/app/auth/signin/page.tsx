"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, Github, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/src/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(error ? "Authentication failed. Please try again." : "")

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
        setLoginError("Invalid email or password")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setLoginError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 scale-110">
              <Logo className="h-8 w-auto" />
            </div>
            <span className="font-bold text-3xl tracking-tighter text-gradient">Mafal-IA</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your business terminal</p>
        </div>

        <Card className="glass border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden neural-border">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm font-medium"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {loginError}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/50 transition-all text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secure Access</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot key?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/50 transition-all text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Initialize Session <LogIn className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Protocol</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl glass border-white/10 hover:bg-white/5 transition-all text-base font-semibold gap-3">
              <Github className="h-5 w-5" />
              Link via Partner Network
            </Button>
          </div>
        </Card>

        <p className="text-center mt-8 text-muted-foreground">
          New partner? <Link href="/auth/signup" className="text-primary font-bold hover:underline">Register entity</Link>
        </p>
      </motion.div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}>
      {children}
    </div>
  )
}
