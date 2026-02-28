import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await params;
        const body = await req.json();
        const { isActive } = body;

        const prisma = await getPrisma();
        const restaurant = await prisma.business.update({
            where: { id },
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
