import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const prisma = await getPrisma();

        const { id } = await params;
        const body = await request.json();

        // Validate body roughly
        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.price !== undefined) updateData.price = parseInt(body.price); // Ensure int
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
        if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;

        const menuItem = await prisma.menuItem.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ menuItem });
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const prisma = await getPrisma();
        const { id } = await params;

        await prisma.menuItem.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
    }
}
