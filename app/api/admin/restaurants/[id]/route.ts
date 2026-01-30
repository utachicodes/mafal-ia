import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request
) {
    try {
        // Extract ID from the URL manually since params is not reliably passed in all Next.js versions/route structures in the same way
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
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
                menuItems: {
                    take: 50,
                    orderBy: { name: 'asc' }
                }
            },
        });

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
        }

        return NextResponse.json({ restaurant });
    } catch (error) {
        console.error("Admin API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch restaurant" },
            { status: 500 }
        );
    }
}
