import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { isActive } = body;

        const restaurant = await prisma.restaurant.update({
            where: { id: params.id },
            data: { isActive },
        });

        return NextResponse.json({ restaurant });
    } catch (error) {
        console.error("Update status error:", error);
        return NextResponse.json(
            { error: "Failed to update restaurant status" },
            { status: 500 }
        );
    }
}
