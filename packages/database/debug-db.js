
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`User: ${u.email} (ID: ${u.id}) - CompanyID: ${u.companyId}`));

    console.log('\n--- CLIENTS ---');
    const clients = await prisma.client.findMany();
    clients.forEach(c => console.log(`Client: ${c.name} (ID: ${c.id}) - CompanyID: ${c.companyId}`));

    if (users.length > 0 && clients.length > 0) {
        const u = users[0];
        const match = clients.filter(c => c.companyId === u.companyId);
        console.log(`\nMatching clients for first user (${u.email}): ${match.length}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
