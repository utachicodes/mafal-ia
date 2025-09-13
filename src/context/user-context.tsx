"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { prisma } from "@/lib/prisma"

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }
  }

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
    } else if (status === "authenticated" && session?.user) {
      refreshUser()
      setIsLoading(false)
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status])

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}