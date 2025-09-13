import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("User not authenticated")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function ensureUserOwnership(userId: string, resourceUserId: string) {
  if (userId !== resourceUserId) {
    throw new Error("Access denied: You don't own this resource")
  }
}

export async function getUserRestaurants(userId: string) {
  return await prisma.restaurant.findMany({
    where: {
      userId: userId
    },
    include: {
      menuItems: true,
      orders: true,
      conversations: true
    }
  })
}

export async function createUserRestaurant(userId: string, restaurantData: any) {
  return await prisma.restaurant.create({
    data: {
      ...restaurantData,
      userId: userId,
    }
  })
}