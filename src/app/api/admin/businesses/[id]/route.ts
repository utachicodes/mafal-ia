import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getPrisma } from "@/src/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const prisma = await getPrisma();
        const restaurant = await prisma.business.findUnique({
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
