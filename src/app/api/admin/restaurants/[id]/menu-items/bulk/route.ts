import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
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

        // Import embedding generator (dynamically to avoid build issues if file not present yet)
        const { generateMenuItemEmbedding } = await import("@/src/lib/embeddings");

        // Process items in parallel to generate embeddings
        const itemsWithEmbeddings = await Promise.all(
            items.map(async (item: any) => {
                let embedding: number[] | null = null;
                try {
                    // Generate vector embedding for semantic search
                    embedding = await generateMenuItemEmbedding({
                        name: item.name,
                        description: item.description || item.name,
                        category: item.category,
                        price: parseInt(item.price) || 0,
                    });
                } catch (e) {
                    console.warn(`Embedding generation failed for ${item.name}, skipping vector.`);
                }

                return {
                    restaurantId: params.id,
                    name: item.name,
                    description: item.description || item.name,
                    price: parseInt(item.price) || 0,
                    category: item.category || "General",
                    isAvailable: true,
                    // If your schema supports vector type, you might need to format this, 
                    // but for now we assume the Prisma model has an 'embedding' field 
                    // of type Unsupported("vector") or similar, often handled as raw SQL or specialized types.
                    // If using a float[] array in Prisma for pgvector:
                    // Use undefined for null to satisfy Prisma InputJsonValue
                    embedding: embedding ?? undefined,
                };
            })
        );

        // Bulk create menu items
        // Note: createMany might not support setting vector fields directly if they are unsupported types,
        // but if using a standard float[] or Json, it works. 
        // We'll proceed assuming standard support or that deployment handles the migration.
        const created = await prisma.menuItem.createMany({
            data: itemsWithEmbeddings,
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
