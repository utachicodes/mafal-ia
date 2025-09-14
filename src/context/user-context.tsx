"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useUser as useStackUser } from "@stackframe/stack"

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
  const stackUser = useStackUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    if (stackUser?.primaryEmail) {
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
    if (stackUser) {
      setUser({
        id: stackUser.id,
        name: stackUser.displayName,
        email: stackUser.primaryEmail || "",
        role: "user" // Default role, can be customized based on your needs
      })
      setIsLoading(false)
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [stackUser])

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