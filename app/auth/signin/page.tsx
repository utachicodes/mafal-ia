"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail, Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>Choisissez une méthode de connexion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
<Button variant="outline" className="w-full justify-start" onClick={() => signIn("google", { callbackUrl: "/profile" })}>
              <Chrome className="h-4 w-4 mr-2" /> Continuer avec Google
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => signIn("github", { callbackUrl: "/profile" })}>
              <Github className="h-4 w-4 mr-2" /> Continuer avec GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); signIn("credentials", { email, password, callbackUrl: "/profile" }) }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              <Mail className="h-4 w-4 mr-2" /> Continuer avec Email
            </Button>
          </form>

          <div className="text-xs text-muted-foreground text-center">
            En continuant, vous acceptez nos <Link href="/legal/dpa" className="underline">Conditions</Link>.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
