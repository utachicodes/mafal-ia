import { NextResponse } from "next/server";
import { getPrisma } from "@/src/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await params;
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
                    businessId: id,
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

        const prisma = await getPrisma();
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
