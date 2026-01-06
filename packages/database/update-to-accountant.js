const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const email = 'shihabhajbe@gmail.com'; // User's email from the token

    console.log(`Updating role for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error(`User ${email} not found!`);
        return;
    }

    // First, ensure an AccountantFirm exists
    let firm = await prisma.accountantFirm.findFirst();
    if (!firm) {
        firm = await prisma.accountantFirm.create({
            data: {
                name: 'Mon Cabinet',
                email: 'contact@firm.com'
            }
        });
        console.log('Created dummy AccountantFirm');
    }

    // Update user to be FIRM_ADMIN and link to firm
    // Note: We need to disconnect company if we want to be pure firm user, 
    // or just update role if schema allows both (schema says companyId OR accountantFirmId usually)

    await prisma.user.update({
        where: { email },
        data: {
            role: 'FIRM_ADMIN',
            companyId: null, // Remove from client company
            accountantFirmId: firm.id
        },
    });

    console.log(`User ${email} is now FIRM_ADMIN and linked to firm ${firm.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
