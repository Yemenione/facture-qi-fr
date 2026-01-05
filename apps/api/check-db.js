
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "file:./dev.db" // Fallback to see if it even tries
        },
    },
});

async function main() {
    console.log('Testing Database Connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connected to Database successfully!');
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);
        process.exit(0);
    } catch (e) {
        console.error('❌ Connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
