
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@mafalia.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = "Mafalia Admin";

    console.log(`Creating admin user: ${email}`);

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: UserRole.ADMIN, // Ensure they are admin
                passwordHash, // Reset password to ensures access
            },
            create: {
                email,
                name,
                passwordHash,
                role: UserRole.ADMIN,
            },
        });
        console.log("✅ Admin user ready:", user.email);
    } catch (e) {
        console.error("❌ Error creating admin:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
