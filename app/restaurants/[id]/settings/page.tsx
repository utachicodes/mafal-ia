"use client"

import DashboardLayout from "@/src/components/dashboard-layout"
import ApiKeyManager from "@/src/components/restaurant/api-key-manager"

export default function RestaurantSettingsPage({ params }: { params: { id: string } }) {
  const restaurantId = params.id
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Restaurant Settings</h1>
          <p className="text-muted-foreground">Manage API access and configuration for this restaurant</p>
        </div>

        <ApiKeyManager restaurantId={restaurantId} />
      </div>
    </DashboardLayout>
  )
}
