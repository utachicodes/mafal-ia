"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Basic validation
    if (!email || !name || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Sending signup request...')
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      })
      
      const data = await response.json()
      console.log('Signup response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account')
      }

      // Sign in the user after successful signup
      console.log('Attempting to sign in...')
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/profile'
      })

      console.log('Sign in result:', result)
      
      if (result?.error) {
        // If sign in fails but account was created, redirect to login
        if (data.success) {
          router.push('/auth/signin?registered=true')
          return
        }
        throw new Error(result.error)
      }

      // Redirect to profile or callback URL
      const redirectUrl = result?.url || '/profile'
      console.log('Redirecting to:', redirectUrl)
      router.push(redirectUrl)
      
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => signIn("google", { callbackUrl: "/profile" })}>
              <Chrome className="h-4 w-4 mr-2" /> Sign up with Google
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => signIn("github", { callbackUrl: "/profile" })}>
              <Github className="h-4 w-4 mr-2" /> Sign up with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                minLength={8}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="underline hover:text-primary">
              Sign in
            </Link>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our{' '}
            <Link href="/legal/terms" className="underline">Terms of Service</Link> and{' '}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
