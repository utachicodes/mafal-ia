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
    const newRestaurant: Restaurant = {
      ...restaurantData,
      // Ensure `menu` is initialized even if upstream provided `menuItems`
      menu: (restaurantData as any).menu ?? (restaurantData as any).menuItems ?? [],
      id: `restaurant_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`, // Temporary ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRestaurant),
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

  const updateRestaurant = useCallback((id: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, ...updates, updatedAt: new Date() } : restaurant,
      ),
    )
  }, [])

  const deleteRestaurant = useCallback((id: string) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id))
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
