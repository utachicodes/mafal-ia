import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

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
