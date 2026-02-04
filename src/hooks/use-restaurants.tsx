"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { type Restaurant } from "@/lib/data"
import { LocalStorage } from "@/src/lib/storage"

interface RestaurantsContextType {
  restaurants: Restaurant[]
  addRestaurant: (restaurant: Omit<Restaurant, "id" | "createdAt" | "updatedAt">) => Promise<string>
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void
  deleteRestaurant: (id: string) => void
  getRestaurantById: (id: string) => Restaurant | undefined
  isLoading: boolean
}

const RestaurantsContext = createContext<RestaurantsContextType | undefined>(undefined)

export function RestaurantsProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/restaurants")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setRestaurants(data as Restaurant[])
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
        // Optionally, handle error state or load from local storage as a fallback
        const stored = LocalStorage.loadRestaurants()
        if (stored && stored.length > 0) {
          setRestaurants(stored as Restaurant[])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])



  const addRestaurant = useCallback(async (restaurantData: Omit<Restaurant, "id" | "createdAt" | "updatedAt">) => {
    // Normalize client payload before sending to API
    const asAny: any = restaurantData || {}
    // Supported languages can be array or JSON string
    let supportedLanguages: string[] = []
    if (Array.isArray(asAny.supportedLanguages)) supportedLanguages = asAny.supportedLanguages
    else if (typeof asAny.supportedLanguages === "string") {
      try { const p = JSON.parse(asAny.supportedLanguages); if (Array.isArray(p)) supportedLanguages = p } catch { }
    }

    // Menu can be array or JSON string
    let menu: any[] = []
    const inputMenu = asAny.menu ?? asAny.menuItems
    if (Array.isArray(inputMenu)) menu = inputMenu
    else if (typeof inputMenu === "string") {
      try { const p = JSON.parse(inputMenu); if (Array.isArray(p)) menu = p } catch { }
    }

    // Coerce each menu item
    const normalizedMenu = (menu || []).map((m: any) => ({
      name: String(m?.name ?? ""),
      description: String(m?.description ?? ""),
      price: Number.isFinite(m?.price) ? Number(m.price) : parseInt(String(m?.price ?? 0), 10) || 0,
      category: m?.category ? String(m.category) : undefined,
      isAvailable: typeof m?.isAvailable === "boolean" ? m.isAvailable : true,
    }))

    const sanitizedPayload = {
      name: String(asAny.name ?? ""),
      description: String(asAny.description ?? ""),
      cuisine: String(asAny.cuisine ?? ""),
      whatsappNumber: String(asAny.whatsappNumber ?? ""),
      supportedLanguages,
      isActive: typeof asAny.isActive === "boolean" ? asAny.isActive : true,
      isConcierge: typeof asAny.isConcierge === "boolean" ? asAny.isConcierge : false,
      menu: normalizedMenu,
      chatbotContext: asAny.chatbotContext ?? {},
      apiCredentials: asAny.apiCredentials ?? {
        whatsappAccessToken: asAny.whatsappAccessToken ?? "",
        whatsappPhoneNumberId: asAny.whatsappPhoneNumberId ?? "",
        webhookVerifyToken: asAny.webhookVerifyToken ?? "",
        whatsappAppSecret: asAny.whatsappAppSecret ?? "",
      },
    }

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedPayload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const savedRestaurant = await response.json()
      setRestaurants((prev) => [...prev, savedRestaurant])
      return savedRestaurant.id
    } catch (error) {
      console.error("Failed to add restaurant:", error)
      throw error
    }
  }, [])

  const updateRestaurant = useCallback(async (id: string, updates: Partial<Restaurant>) => {
    // Optimistic update
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, ...updates, updatedAt: new Date() } : restaurant,
      ),
    )

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to update restaurant:", error)
      // Revert optimistic update on failure (simplified: reload data)
      // For now, just logging error.Ideally would revert.
    }
  }, [])

  const deleteRestaurant = useCallback(async (id: string) => {
    // Optimistic update
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id))

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to delete restaurant:", error)
    }
  }, [])

  const getRestaurantById = useCallback(
    (id: string) => {
      return restaurants.find((restaurant) => restaurant.id === id)
    },
    [restaurants],
  )

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        getRestaurantById,
        isLoading,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  )
}

export function useRestaurants() {
  const context = useContext(RestaurantsContext)
  if (context === undefined) {
    throw new Error("useRestaurants must be used within a RestaurantsProvider")
  }
  return context
}
