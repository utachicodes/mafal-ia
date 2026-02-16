
import { PrismaClient } from '@prisma/client'
import { searchMenuItemsByVector } from '@/src/lib/embeddings'

const prisma = new PrismaClient()

async function main() {
    const testId = 'rag-test-bistro-' + Date.now()
    console.log(`Creating test restaurant: ${testId}`)

    try {
        // 1. Create Restaurant
        const user = await prisma.user.findFirst()
        if (!user) throw new Error("No user found to assign owner")

        const restaurant = await prisma.restaurant.create({
            data: {
                id: testId,
                name: "RAG Test Bistro",
                description: "A place for rigorous testing",
                cuisine: "Test Food",
                whatsappNumber: "1234567890",
                supportedLanguages: ["en"],
                userId: user.id,
                menuItems: {
                    create: [{
                        name: "Quantum Durum",
                        description: "A wrap that exists in two states until eaten. Super spicy and cold at the same time.",
                        price: 5000,
                        category: "Specials",
                        isAvailable: true
                    }]
                }
            }
        })
        console.log("Restaurant created with menu item.")

        // 2. Test Retrieval (Simulating RAG)
        const query = "Quantum"
        console.log(`\nTesting retrieval for query: "${query}"...`)

        // We use searchMenuItemsByVector which handles embedding generation OR fallback to text search
        // This proves we are NOT using hardcoded data, but DB data.
        const results = await searchMenuItemsByVector(restaurant.id, query)

        console.log("Retrieval Results:", JSON.stringify(results, null, 2))

        // 3. Verification
        const found = results.find(i => i.name === "Quantum Durum")
        if (found) {
            console.log("\n✅ SUCCESS: 'Quantum Durum' was retrieved from the database!")
            console.log(`   Logic used: ${found.similarity ? 'Vector/Embedding' : 'Text Search Fallback'}`)
        } else {
            console.error("\n❌ FAILURE: 'Quantum Durum' was NOT retrieved.")
            process.exit(1)
        }

    } catch (e) {
        console.error("Error during RAG verification:", e)
        process.exit(1)
    } finally {
        // Cleanup
        await prisma.menuItem.deleteMany({ where: { restaurantId: testId } })
        await prisma.restaurant.delete({ where: { id: testId } })
        await prisma.$disconnect()
    }
}

main()
