export type RegistryMenuItem = {
  name: string
  description?: string
  price?: number
  category?: string
  isAvailable?: boolean
}

export type RestaurantConfig = {
  name: string
  description?: string
  cuisine?: string
  businessHours?: string
  deliveryInfo?: string
  location?: string
  welcomeMessage?: string
  orderingEnabled?: boolean
  menu?: RegistryMenuItem[]
}

// Simple in-memory registry; resets on server restart
const registry = new Map<string, RestaurantConfig>()

export const Registry = {
  set(id: string, cfg: RestaurantConfig) {
    registry.set(id, cfg)
  },
  get(id: string): RestaurantConfig | undefined {
    return registry.get(id)
  },
}
