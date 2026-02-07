import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const phone = "221771234567";
    console.log(`Updating restaurant with phone ${phone}...`);
    try {
        const existing = await prisma.restaurant.findFirst({
            where: { whatsappNumber: phone }
        });
        console.log("Found:", existing);

        const r = await prisma.restaurant.updateMany({
            where: { whatsappNumber: phone },
            data: { isVerified: true }
        });
        console.log("Updated count:", r.count);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
