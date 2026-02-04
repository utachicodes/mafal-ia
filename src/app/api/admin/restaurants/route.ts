import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const restaurants = await prisma.restaurant.findMany({
            include: {
                _count: {
                    select: {
                        menuItems: true,
                        conversations: true,
                        orders: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ restaurants });
    } catch (error) {
        console.error("Admin API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch restaurants" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { name, cuisine, whatsappNumber, ownerEmail, ownerName, ownerPassword } = body;

        // Validate required fields
        if (!name || !whatsappNumber || !ownerEmail || !ownerPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if owner already exists
        let owner = await prisma.user.findUnique({
            where: { email: ownerEmail },
        });

        if (owner) {
            if (owner.role !== "RESTAURANT_OWNER") {
                return NextResponse.json(
                    { error: "User exists but is not a restaurant owner" },
                    { status: 400 }
                );
            }
        } else {
            // Create new owner
            const passwordHash = await bcrypt.hash(ownerPassword, 10);
            owner = await prisma.user.create({
                data: {
                    email: ownerEmail,
                    name: ownerName || "Restaurant Owner",
                    passwordHash,
                    role: "RESTAURANT_OWNER",
                },
            });
        }

        // Create Restaurant
        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                cuisine: cuisine || "General",
                whatsappNumber,
                userId: owner.id, // Legacy compatibility
                ownerId: owner.id,
                createdById: (session.user as any).id,
                supportedLanguages: ["fr"],
                isActive: true,
                description: "", // Default description
            },
        });

        return NextResponse.json({ restaurant, ownerId: owner.id });
    } catch (error: any) {
        console.error("Create restaurant error:", error);
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Restaurant with this WhatsApp number already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create restaurant" },
            { status: 500 }
        );
    }
}
