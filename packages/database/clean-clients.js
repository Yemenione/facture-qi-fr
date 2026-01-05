
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning DB deep...');
    try {
        // Attempt to delete InvoiceItems if they exist (ignoring error if model doesn't exist yet but it should)
        // Checking schema for InvoiceItem... usually valid.
        try {
            const ii = await prisma.invoiceItem.deleteMany({});
            console.log(`Deleted ${ii.count} invoice items.`);
        } catch (e) { console.log("InvoiceItem delete failed/skipped", e.message); }

        const i = await prisma.invoice.deleteMany({});
        console.log(`Deleted ${i.count} invoices.`);

        const c = await prisma.client.deleteMany({});
        console.log(`Deleted ${c.count} clients.`);
    } catch (e) {
        console.error("Error cleaning:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
