const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔧 Quick Sync Fix\n");

    // Get accountant
    const accountant = await prisma.user.findFirst({
        where: { email: 'expert@cabinet.fr' }
    });

    if (!accountant) {
        console.log("❌ No accountant found");
        return;
    }

    console.log(`Found: ${accountant.email}`);
    console.log(`FirmId: ${accountant.accountantFirmId}`);

    // Get company
    const company = await prisma.company.findFirst({
        where: { email: 'contact@cabinet.fr' }
    });

    if (!company) {
        console.log("❌ No company found");
        return;
    }

    console.log(`Company: ${company.name}`);
    console.log(`Current FirmId: ${company.accountantFirmId}`);

    // Fix if needed
    if (accountant.accountantFirmId && company.accountantFirmId !== accountant.accountantFirmId) {
        await prisma.company.update({
            where: { id: company.id },
            data: { accountantFirmId: accountant.accountantFirmId }
        });
        console.log("\n✅ FIXED! Company linked to firm.");
    } else if (company.accountantFirmId === accountant.accountantFirmId) {
        console.log("\n✅ Already synced!");
    } else {
        console.log("\n⚠️  Accountant has no firmId");
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
