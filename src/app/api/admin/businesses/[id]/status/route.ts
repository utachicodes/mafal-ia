import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getPrisma } from "@/src/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

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
