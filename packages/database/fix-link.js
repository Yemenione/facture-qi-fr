const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔗 Fixing Company-Firm Link...\n");

    // Get the accountant user to find their firmId
    const accountant = await prisma.user.findUnique({
        where: { email: 'expert@cabinet.fr' }
    });

    if (!accountant || !accountant.accountantFirmId) {
        console.log("❌ No accountant found or no firmId");
        return;
    }

    console.log(`✅ Found accountant with firmId: ${accountant.accountantFirmId}`);

    // Find the company
    const company = await prisma.company.findUnique({
        where: { email: 'contact@cabinet.fr' }
    });

    if (!company) {
        console.log("❌ No company found");
        return;
    }

    // Update company to link to firm
    const updated = await prisma.company.update({
        where: { id: company.id },
        data: {
            accountantFirmId: accountant.accountantFirmId
        }
    });

    console.log(`✅ Company "${updated.name}" linked to firm!`);
    console.log(`\n🎉 Ready! Login as: expert@cabinet.fr / password123`);
}

main()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
