"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { type Restaurant, mockRestaurants } from "@/lib/data"
import { generateApiKey } from "@/src/lib/data-utils"
import { LocalStorage } from "@/src/lib/storage"

interface RestaurantsContextType {
  restaurants: Restaurant[]
  addRestaurant: (restaurant: Omit<Restaurant, "id" | "apiKey" | "createdAt" | "updatedAt">) => void
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void
  deleteRestaurant: (id: string) => void
  getRestaurantById: (id: string) => Restaurant | undefined
  regenerateApiKey: (id: string) => void
  isLoading: boolean
}

const RestaurantsContext = createContext<RestaurantsContextType | undefined>(undefined)

export function RestaurantsProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const stored = LocalStorage.loadRestaurants()
      if (stored && stored.length > 0) {
        setRestaurants(stored)
      } else {
        setRestaurants(mockRestaurants)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!isLoading && restaurants.length > 0) {
      LocalStorage.saveRestaurants(restaurants)
    }
  }, [restaurants, isLoading])

  const addRestaurant = useCallback((restaurantData: Omit<Restaurant, "id" | "apiKey" | "createdAt" | "updatedAt">) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: `restaurant_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      apiKey: generateApiKey(restaurantData.name),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setRestaurants((prev) => [...prev, newRestaurant])
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

  const regenerateApiKey = useCallback(
    (id: string) => {
      const restaurant = restaurants.find((r) => r.id === id)
      if (restaurant) {
        const newApiKey = generateApiKey(restaurant.name)
        updateRestaurant(id, { apiKey: newApiKey })
      }
    },
    [restaurants, updateRestaurant],
  )

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        getRestaurantById,
        regenerateApiKey,
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
