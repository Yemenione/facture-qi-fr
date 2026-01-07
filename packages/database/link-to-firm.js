const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔗 Linking Company to AccountantFirm...\n");

    // 1. Create or get AccountantFirm
    let firm = await prisma.accountantFirm.findUnique({
        where: { email: 'cabinet@expert-comptable.fr' }
    });

    if (!firm) {
        firm = await prisma.accountantFirm.create({
            data: {
                name: 'Cabinet Expert Comptable',
                email: 'cabinet@expert-comptable.fr',
                phone: '+33 1 23 45 67 89'
            }
        });
        console.log(`✅ Firm created: ${firm.name}`);
    } else {
        console.log(`✅ Firm exists: ${firm.name}`);
    }

    // 2. Update existing user to be ACCOUNTANT
    const user = await prisma.user.update({
        where: { email: 'expert@cabinet.fr' },
        data: {
            role: 'ACCOUNTANT',
            accountantFirmId: firm.id
        }
    });
    console.log(`✅ User updated to ACCOUNTANT: ${user.email}`);

    // 3. Link existing company to the firm
    const company = await prisma.company.update({
        where: { email: 'contact@cabinet.fr' },
        data: {
            accountantFirmId: firm.id
        }
    });
    console.log(`✅ Company linked to firm: ${company.name}`);

    console.log("\n🎉 Setup complete!");
    console.log(`   Login: expert@cabinet.fr / password123`);
    console.log(`   Company: ${company.name}`);
}

main()
    .catch(e => {
        console.error('❌ Error:', e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
