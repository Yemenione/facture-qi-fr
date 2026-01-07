import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Company } from '@prisma/client';

@Injectable()
export class AccountingService {
    constructor(private prisma: PrismaService) { }

    async generateFEC(companyId: string, year: number): Promise<string> {
        // Fetch company
        const company = await this.prisma.company.findUnique({ where: { id: companyId } });
        if (!company) throw new Error("Company not found");

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        // Fetch Invoices (Sales)
        const invoices = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['PAID', 'VALIDATED'] }, // Only finalized invoices
                issueDate: { gte: startDate, lte: endDate }
            },
            include: { client: true, items: true }
        });

        // FEC Columns (Standard)
        // JournalCode | JournalLib | EcritureNum | EcritureDate | CompteNum | CompteLib | CompAuxNum | CompAuxLib | PieceRef | PieceDate | EcritureLib | Debit | Credit | EcritureLet | DateLet | ValidDate | MontantDevise | Idevise

        const rows: string[] = [];
        // Header row
        rows.push("JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|MontantDevise|Idevise");

        for (const inv of invoices) {
            const dateStr = inv.issueDate.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
            const ref = inv.invoiceNumber;
            const libelle = `Facture ${ref} - ${inv.client?.name || 'Client'}`;

            // 1. Client Receivables (Debit 411)
            rows.push(this.formatRow({
                journal: 'VT', journalLib: 'Ventes',
                ecritureNum: ref, ecritureDate: dateStr,
                compteNum: '411000', compteLib: 'Clients',
                compAuxNum: 'C' + (inv.clientId.substr(-6) || 'UNKNOWN'), compAuxLib: inv.client?.name || '',
                pieceRef: ref, pieceDate: dateStr,
                ecritureLib: libelle,
                debit: inv.total, credit: 0,
                validDate: dateStr
            }));

            // 2. Sales Revenue (Credit 706) - Simplified (assuming services)
            // Ideally we check VAT rates to split, but for MVP we take total ex-tax
            rows.push(this.formatRow({
                journal: 'VT', journalLib: 'Ventes',
                ecritureNum: ref, ecritureDate: dateStr,
                compteNum: '706000', compteLib: 'Prestations de services',
                compAuxNum: '', compAuxLib: '',
                pieceRef: ref, pieceDate: dateStr,
                ecritureLib: libelle,
                debit: 0, credit: (inv as any).subTotal || (inv.total - inv.taxAmount),
                validDate: dateStr
            }));

            // 3. VAT (Credit 44571)
            if (inv.taxAmount > 0) {
                rows.push(this.formatRow({
                    journal: 'VT', journalLib: 'Ventes',
                    ecritureNum: ref, ecritureDate: dateStr,
                    compteNum: '445710', compteLib: 'TVA Collectée',
                    compAuxNum: '', compAuxLib: '',
                    pieceRef: ref, pieceDate: dateStr,
                    ecritureLib: libelle,
                    debit: 0, credit: inv.taxAmount,
                    validDate: dateStr
                }));
            }
        }

        // Add Expenses (Purchases) - Assuming Expense model exists
        const expenses = await this.prisma.expense.findMany({
            where: {
                companyId,
                status: 'PAID',
                date: { gte: startDate, lte: endDate }
            }
        });

        for (const exp of expenses) {
            const dateStr = exp.date.toISOString().split('T')[0].replace(/-/g, '');
            const ref = `DEP-${exp.id.substr(-6)}`;
            const libelle = exp.description || 'Dépense diverse';

            // 1. Expense Account (Debit 6xxx) - Simplification: 606000
            rows.push(this.formatRow({
                journal: 'AC', journalLib: 'Achats',
                ecritureNum: ref, ecritureDate: dateStr,
                compteNum: '606000', compteLib: 'Achats non stockés',
                compAuxNum: '', compAuxLib: '',
                pieceRef: ref, pieceDate: dateStr,
                ecritureLib: libelle,
                // Assuming amount is total for now, if tax exists we should split
                debit: exp.amount, credit: 0,
                validDate: dateStr
            }));

            // 2. Supplier/Bank (Credit 401 or 512) - Simplification: paid directly so bank
            rows.push(this.formatRow({
                journal: 'AC', journalLib: 'Achats',
                ecritureNum: ref, ecritureDate: dateStr,
                compteNum: '512000', compteLib: 'Banque',
                compAuxNum: '', compAuxLib: '',
                pieceRef: ref, pieceDate: dateStr,
                ecritureLib: libelle,
                debit: 0, credit: exp.amount,
                validDate: dateStr
            }));
        }

        return rows.join('\r\n');
    }

    private formatRow(data: any): string {
        // JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|MontantDevise|Idevise

        const debit = data.debit ? data.debit.toFixed(2).replace('.', ',') : '0,00';
        const credit = data.credit ? data.credit.toFixed(2).replace('.', ',') : '0,00';

        return [
            data.journal, // JournalCode
            data.journalLib, // JournalLib
            data.ecritureNum, // EcritureNum
            data.ecritureDate, // EcritureDate
            data.compteNum, // CompteNum
            data.compteLib, // CompteLib
            data.compAuxNum || '', // CompAuxNum
            data.compAuxLib || '', // CompAuxLib
            data.pieceRef, // PieceRef
            data.pieceDate, // PieceDate
            data.ecritureLib, // EcritureLib
            debit, // Debit
            credit, // Credit
            '', // EcritureLet
            '', // DateLet
            data.validDate, // ValidDate
            '', // MontantDevise
            '' // Idevise
        ].join('|');
    }
}
