import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking restaurants in database...\n");

    const restaurants = await prisma.restaurant.findMany({
        select: {
            id: true,
            name: true,
            whatsappNumber: true,
            isVerified: true,
            userId: true
        }
    });

    console.log(`Found ${restaurants.length} restaurant(s):\n`);
    restaurants.forEach(r => {
        console.log(`- ${r.name}`);
        console.log(`  Phone: ${r.whatsappNumber}`);
        console.log(`  Verified: ${r.isVerified}`);
        console.log(`  ID: ${r.id}`);
        console.log(`  User ID: ${r.userId}\n`);
    });

    // Check for the specific test number
    const testRestaurant = await prisma.restaurant.findFirst({
        where: { whatsappNumber: "221771234567" }
    });

    if (testRestaurant) {
        console.log("✓ Test restaurant (221771234567) exists and is verified:", testRestaurant.isVerified);
    } else {
        console.log("✗ Test restaurant (221771234567) NOT FOUND");
        console.log("  The webhook test is using phone '221771234567' but no restaurant exists with this number.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
