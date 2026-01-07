const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Accountant Portal Data...\n");

    // 1. Create Accountant Firm
    const firm = await prisma.accountantFirm.upsert({
        where: { email: 'cabinet@expert-comptable.fr' },
        update: {},
        create: {
            name: 'Cabinet Expert Comptable',
            email: 'cabinet@expert-comptable.fr',
            phone: '+33 1 23 45 67 89'
        }
    });
    console.log(`✅ Firm created: ${firm.name} (ID: ${firm.id})`);

    // 2. Create Accountant User
    const accountant = await prisma.user.upsert({
        where: { email: 'accountant@expert.fr' },
        update: {},
        create: {
            email: 'accountant@expert.fr',
            password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // "password123"
            name: 'Jean Dupont',
            role: 'ACCOUNTANT',
            accountantFirmId: firm.id
        }
    });
    console.log(`✅ Accountant created: ${accountant.email} (ID: ${accountant.id})`);

    // 3. Create a Test Company linked to the Firm
    const company = await prisma.company.upsert({
        where: { email: 'client@entreprise.fr' },
        update: {},
        create: {
            name: 'Entreprise Test SAS',
            email: 'client@entreprise.fr',
            siret: '12345678901234',
            vatNumber: 'FR12345678901',
            subscriptionStatus: 'ACTIVE',
            accountantFirmId: firm.id
        }
    });
    console.log(`✅ Company created: ${company.name} (ID: ${company.id})`);

    // 4. Create a User for the Company
    const companyUser = await prisma.user.upsert({
        where: { email: 'user@entreprise.fr' },
        update: {},
        create: {
            email: 'user@entreprise.fr',
            password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
            name: 'Marie Martin',
            role: 'ADMIN',
            companyId: company.id
        }
    });
    console.log(`✅ Company User created: ${companyUser.email}`);

    console.log("\n🎉 Seeding complete! You can now:");
    console.log(`   - Login as Accountant: accountant@expert.fr`);
    console.log(`   - Impersonate Company: ${company.name}`);
}

main()
    .catch(e => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
