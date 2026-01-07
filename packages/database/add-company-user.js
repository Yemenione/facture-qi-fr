const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const company = await prisma.company.findFirst({
        where: { email: 'test@entreprise.fr' }
    });

    if (!company) {
        console.log("❌ Company not found");
        return;
    }

    console.log(`Found company: ${company.name}`);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: 'user@entreprise.fr',
            password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
            firstName: 'Marie',
            lastName: 'Martin',
            role: 'ADMIN',
            companyId: company.id
        }
    });

    console.log(`✅ User created: ${user.email}`);
    console.log("\n🎉 NOW TRY AGAIN!");
}

main()
    .catch(e => console.error('❌ Error:', e.message))
    .finally(() => prisma.$disconnect());
