const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Checking Accountants ---");
    const accountants = await prisma.user.findMany({
        where: { role: 'ACCOUNTANT' },
        select: { id: true, email: true, accountantFirmId: true }
    });
    console.table(accountants);

    console.log("\n--- Checking Companies Linked to Firms ---");
    const companies = await prisma.company.findMany({
        where: { accountantFirmId: { not: null } },
        select: { id: true, name: true, accountantFirmId: true }
    });
    console.table(companies);

    if (accountants.length > 0 && companies.length > 0) {
        const accountant = accountants[0];
        const company = companies[0];

        console.log("\n--- Integrity Test ---");
        console.log(`Accountant Firm: ${accountant.accountantFirmId}`);
        console.log(`Company Firm:    ${company.accountantFirmId}`);
        console.log(`Match?           ${accountant.accountantFirmId === company.accountantFirmId}`);
    } else {
        console.log("\nNo data to compare.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
