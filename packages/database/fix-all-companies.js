const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const accountant = await prisma.user.findFirst({
        where: { email: 'expert@cabinet.fr' }
    });

    console.log(`Accountant firmId: ${accountant?.accountantFirmId}\n`);

    const allCompanies = await prisma.company.findMany({
        select: { id: true, name: true, email: true, accountantFirmId: true }
    });

    console.log("=== All Companies ===");
    allCompanies.forEach(c => {
        const match = c.accountantFirmId === accountant?.accountantFirmId ? '✅' : '❌';
        console.log(`${match} ${c.id} - ${c.name} (firmId: ${c.accountantFirmId || 'NULL'})`);
    });

    // Fix: Link all companies to the accountant's firm
    if (accountant?.accountantFirmId) {
        console.log(`\n🔧 Fixing: Linking all companies to firm ${accountant.accountantFirmId}...`);

        const result = await prisma.company.updateMany({
            data: { accountantFirmId: accountant.accountantFirmId }
        });

        console.log(`✅ Updated ${result.count} companies!`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
