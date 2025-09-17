"use client"

import { createContext, useContext, useEffect, useState } from "react"

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshUser = async () => {
    // No-op: auth removed
    setUser(null)
  }

  useEffect(() => {
    // Ensure stable defaults in client-only provider
    setUser(null)
    setIsLoading(false)
  }, [])

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