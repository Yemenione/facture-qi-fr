const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🏢 Creating Test Company (Simple)\n");

    // Get accountant's firmId
    const accountant = await prisma.user.findFirst({
        where: { email: 'expert@cabinet.fr' }
    });

    if (!accountant || !accountant.accountantFirmId) {
        console.log("❌ No accountant or firmId found");
        return;
    }

    console.log(`✅ Accountant: ${accountant.email}`);
    console.log(`   FirmId: ${accountant.accountantFirmId}`);

    // Find or create a subscription plan
    let plan = await prisma.subscriptionPlan.findFirst();

    if (!plan) {
        plan = await prisma.subscriptionPlan.create({
            data: {
                code: 'STANDARD',
                name: 'Standard',
                price: 29.99,
                features: {}
            }
        });
        console.log(`✅ Plan created: ${plan.name}`);
    }

    // Create company
    const company = await prisma.company.create({
        data: {
            name: 'Entreprise Test SAS',
            email: 'test@entreprise.fr',
            siren: '123456789',
            siret: '12345678901234',
            vatNumber: 'FR12345678901',
            address: {},
            subscriptionStatus: 'ACTIVE',
            accountantFirmId: accountant.accountantFirmId,
            planId: plan.id
        }
    });

    console.log(`\n✅ Company created: ${company.name}`);
    console.log(`   Linked to firm: ${company.accountantFirmId}`);

    // Create a user for the company
    const companyUser = await prisma.user.create({
        data: {
            email: 'user@entreprise.fr',
            password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
            firstName: 'Marie',
            lastName: 'Martin',
            role: 'ADMIN',
            companyId: company.id
        }
    });

    console.log(`✅ Company user created: ${companyUser.email}`);
    console.log("\n🎉 Ready! Login as: expert@cabinet.fr / password123");
}

main()
    .catch(e => console.error('❌ Error:', e.message))
    .finally(() => prisma.$disconnect());
