"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, UserPlus, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/src/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate real signup
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-[3rem] border border-primary/20 max-w-md space-y-6"
        >
          <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold">Account Created</h1>
          <p className="text-muted-foreground">Your restaurant instance is being provisioned. You can now initialize your first AI branch.</p>
          <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90">
            <Link href="/auth/signin">Access Dashboard</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Join the Network</h1>
          <p className="text-muted-foreground">Automate your restaurant operations with AI agents</p>
        </div>

        <Card className="glass border-white/10 p-8 rounded-[2rem] shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Partner Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Full Name / Restaurant Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/50 transition-all text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/50 transition-all text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="Create Secure Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/50 transition-all text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Identity...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Initialize Hub <UserPlus className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Network Verification</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            By joining, you agree to the AI Terms of Operation
          </div>
        </Card>

        <p className="text-center mt-8 text-muted-foreground">
          Existing partner? <Link href="/auth/signin" className="text-primary font-bold hover:underline">Secure Login</Link>
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
