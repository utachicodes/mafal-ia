import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
    try {

        const prisma = await getPrisma();
        const restaurants = await prisma.business.findMany({
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

        const body = await req.json();
        const { name, cuisine, whatsappNumber, ownerEmail, ownerName, ownerPassword } = body;

        // Validate required fields
        if (!name || !whatsappNumber || !ownerEmail || !ownerPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const prisma = await getPrisma();
        // Check if owner already exists
        let owner = await prisma.user.findUnique({
            where: { email: ownerEmail },
        });

        if (owner) {
            if (owner.role !== "BUSINESS_OWNER") {
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
                    role: "BUSINESS_OWNER",
                },
            });
        }

        // Create Restaurant
        const restaurant = await prisma.business.create({
            data: {
                name,
                cuisine: cuisine || "General",
                whatsappNumber,
                userId: owner.id, // Legacy compatibility
                ownerId: owner.id,
                createdById: owner.id,
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
