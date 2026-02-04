import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const id = params.id;
        const body = await request.json();
        const { lamApiKey, lamBaseUrl } = body;

        const restaurant = await prisma.restaurant.update({
            where: { id },
            data: {
                lamApiKey,
                lamBaseUrl
            }
        });

        return NextResponse.json({ success: true, restaurant });
    } catch (error) {
        console.error("Integrations API error:", error);
        return NextResponse.json(
            { error: "Failed to update integrations" },
            { status: 500 }
        );
    }
}
