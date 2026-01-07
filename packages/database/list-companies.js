const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const companies = await prisma.company.findMany({
        select: { id: true, name: true, email: true, accountantFirmId: true }
    });

    console.log("=== All Companies ===");
    console.table(companies);

    const accountant = await prisma.user.findFirst({
        where: { email: 'expert@cabinet.fr' }
    });

    console.log(`\nAccountant firmId: ${accountant?.accountantFirmId}`);

    if (companies.length > 0) {
        const match = companies.find(c => c.accountantFirmId === accountant?.accountantFirmId);
        console.log(`\nMatching company: ${match ? match.name : 'NONE'}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
