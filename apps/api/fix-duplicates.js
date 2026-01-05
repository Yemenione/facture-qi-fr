const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Checking for duplicate Invoices (DRAFT)...');

        // Find all invoices with 'DRAFT' number
        const drafts = await prisma.invoice.findMany({
            where: {
                OR: [
                    { invoiceNumber: 'DRAFT' },
                    { invoiceNumber: 'Draft' } // Case sensitivity check just in case
                ]
            }
        });

        console.log(`Found ${drafts.length} invoices marked as DRAFT.`);

        if (drafts.length <= 1) {
            console.log('✅ No obvious DRAFT duplicates (global check). Checking per company...');
        }

        // Group by companyId
        const draftsByCompany = {};
        for (const invoice of drafts) {
            const companyId = invoice.companyId;
            if (!draftsByCompany[companyId]) {
                draftsByCompany[companyId] = [];
            }
            draftsByCompany[companyId].push(invoice);
        }

        let fixedCount = 0;

        for (const companyId in draftsByCompany) {
            const companyDrafts = draftsByCompany[companyId];
            if (companyDrafts.length > 1) {
                console.log(`⚠️ Company ${companyId} has ${companyDrafts.length} duplicate DRAFT invoices.`);

                // Keep the first one as DRAFT (or rename all to avoid confusion, let's rename duplicates)
                // Skip the first one, rename the rest
                for (let i = 1; i < companyDrafts.length; i++) {
                    const invoice = companyDrafts[i];
                    const newNumber = `DRAFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                    console.log(`🛠️ Fixing Invoice ${invoice.id} -> ${newNumber}`);

                    await prisma.invoice.update({
                        where: { id: invoice.id },
                        data: { invoiceNumber: newNumber }
                    });
                    fixedCount++;
                }
            }
        }

        console.log(`✅ Cleanup completed. Fixed ${fixedCount} duplicate invoices.`);

    } catch (e) {
        console.error('❌ Error during cleanup:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
