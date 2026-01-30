import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { items } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: "Invalid items array" },
                { status: 400 }
            );
        }

        // Bulk create menu items
        const created = await prisma.menuItem.createMany({
            data: items.map((item: any) => ({
                restaurantId: params.id,
                name: item.name,
                description: item.description || item.name,
                price: parseInt(item.price) || 0,
                category: item.category || "General",
                isAvailable: true,
            })),
        });

        return NextResponse.json({
            success: true,
            count: created.count,
        });
    } catch (error: any) {
        console.error("Bulk create error:", error);
        return NextResponse.json(
            { error: "Failed to save menu items" },
            { status: 500 }
        );
    }
}
