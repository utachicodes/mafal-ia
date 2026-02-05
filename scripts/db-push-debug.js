
const { execSync } = require('child_process');
require('dotenv').config();

console.log("Checking database connection...");

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("❌ DATABASE_URL is missing from .env");
    process.exit(1);
}

console.log(`✅ DATABASE_URL found (length: ${dbUrl.length})`);

try {
    console.log("Running prisma db push...");
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log("✅ Schema pushed successfully!");
} catch (error) {
    console.error("❌ Prisma db push failed.");
    process.exit(1);
}
