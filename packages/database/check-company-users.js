const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const company = await prisma.company.findFirst({
        where: { email: 'test@entreprise.fr' },
        include: { users: true }
    });

    console.log("=== Company Check ===");
    console.log(`Name: ${company?.name}`);
    console.log(`Email: ${company?.email}`);
    console.log(`FirmId: ${company?.accountantFirmId}`);
    console.log(`Users count: ${company?.users.length || 0}`);

    if (company?.users.length) {
        console.log("\nUsers:");
        company.users.forEach(u => {
            console.log(`  - ${u.email} (${u.role})`);
        });
    } else {
        console.log("\n⚠️  NO USERS! This will cause 404");
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
