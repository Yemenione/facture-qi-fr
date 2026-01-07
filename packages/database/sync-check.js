const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Full Database Check...\n");

    // Check AccountantFirm
    const firms = await prisma.accountantFirm.findMany();
    console.log("=== AccountantFirms ===");
    console.table(firms.map(f => ({ id: f.id, name: f.name, email: f.email })));

    // Check Users
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, accountantFirmId: true, companyId: true }
    });
    console.log("\n=== Users ===");
    console.table(users);

    // Check Companies
    const companies = await prisma.company.findMany({
        select: { id: true, name: true, email: true, accountantFirmId: true }
    });
    console.log("\n=== Companies ===");
    console.table(companies);

    // Check if we can fix the link
    if (users.length > 0 && companies.length > 0) {
        const accountant = users.find(u => u.role === 'ACCOUNTANT');
        const company = companies[0];
        
        console.log("\n=== Sync Check ===");
        if (accountant) {
            console.log(`Accountant firmId: ${accountant.accountantFirmId}`);
            console.log(`Company firmId:    ${company.accountantFirmId}`);
            console.log(`Match: ${accountant.accountantFirmId === company.accountantFirmId}`);
            
            if (accountant.accountantFirmId && accountant.accountantFirmId !== company.accountantFirmId) {
                console.log("\n⚠️  MISMATCH DETECTED - Fixing...");
                await prisma.company.update({
                    where: { id: company.id },
                    data: { accountantFirmId: accountant.accountantFirmId }
                });
                console.log("✅ Fixed!");
            }
        }
    }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
