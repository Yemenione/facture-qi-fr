
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { format } from 'date-fns';

@Injectable()
export class FecService {
    constructor(private prisma: PrismaService) { }

    async generateFec(companyId: string, year: number) {
        // 1. Fetch Company Settings & Data
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: { settings: true }
        });

        if (!company) throw new NotFoundException('Company not found');

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        // 2. Fetch Invoices (Sales)
        const invoices = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PAID', 'PARTIALLY_PAID'] },
                issueDate: { gte: startDate, lte: endDate }
            },
            include: { client: true, items: true }
        });

        // 3. Fetch Expenses (Purchases)
        const expenses = await this.prisma.expense.findMany({
            where: {
                companyId,
                status: { in: ['APPROVED', 'PAID'] },
                date: { gte: startDate, lte: endDate }
            }
        });

        const entries: any[] = [];
        let ecritureNum = 1;

        // 4. Process Sales (Ventes)
        for (const invoice of invoices) {
            const dateStr = format(invoice.issueDate, 'yyyyMMdd');
            const ref = invoice.invoiceNumber;
            const pieceRef = invoice.invoiceNumber;
            const libelle = `Facture ${invoice.invoiceNumber} - ${invoice.client.name}`;

            // 4.1 Credit Sales Account (706000 or specific)
            // Simplified: One line per invoice total for now (ideal: 1 line per item if diff accounts)
            // We'll use defaultSalesAccount. 
            // In a pro implementation we iterate items to check Product.accountingAccount
            const ht = invoice.subTotal;
            const tva = invoice.taxAmount;
            const ttc = invoice.total;

            const salesAccount = company.settings?.defaultSalesAccount || '706000';
            const vatAccount = company.settings?.defaultVatAccount || '445710';

            // Credit HT (Produit)
            entries.push(this.createEntry('VT', ecritureNum, dateStr, salesAccount, libelle, 0, ht, ref, pieceRef));

            // Credit VAT (TVA Collectée)
            if (tva > 0) {
                entries.push(this.createEntry('VT', ecritureNum, dateStr, vatAccount, libelle, 0, tva, ref, pieceRef));
            }

            // Debit Client (411 + Aux)
            // Client Code: 411 + (client.accountingCode OR client.id suffix)
            const clientAux = invoice.client.accountingCode || 'CLT' + invoice.client.id.substring(20);
            const clientAccount = '411' + clientAux; // Simplification, usually separate CompteNum/CompteAux

            // Actually FEC asks for CompteNum (Plan Comptable) AND CompteAux (Client ID)
            // Valid CompteNum is 411000. CompteAux is the client ID.
            entries.push(this.createEntry('VT', ecritureNum, dateStr, '411000', libelle, ttc, 0, ref, pieceRef, clientAux));

            ecritureNum++;
        }

        // 5. Process Purchases (Achats)
        for (const expense of expenses) {
            const dateStr = format(expense.date, 'yyyyMMdd');
            const ref = expense.description.substring(0, 15); // simple ref
            const pieceRef = expense.id.substring(0, 10);
            const libelle = expense.description;

            const purchaseAccount = company.settings?.defaultPurchasesAccount || '606400';
            const vatAccount = '445660'; // TVA Deductible

            const amount = expense.amount; // Assuming this is TTC in current simplified model? No, amount usually TTC.
            // But we have vatAmount in DB.
            const tva = expense.vatAmount || 0;
            const ht = amount - tva;

            // Debit Expense (Charge)
            entries.push(this.createEntry('AC', ecritureNum, dateStr, purchaseAccount, libelle, ht, 0, ref, pieceRef));

            // Debit VAT (TVA Deductible)
            if (tva > 0) {
                entries.push(this.createEntry('AC', ecritureNum, dateStr, vatAccount, libelle, tva, 0, ref, pieceRef));
            }

            // Credit Supplier (401)
            const supplierAux = 'FRN' + expense.id.substring(20);
            entries.push(this.createEntry('AC', ecritureNum, dateStr, '401000', libelle, 0, amount, ref, pieceRef, supplierAux));

            ecritureNum++;
        }

        return this.formatToCsv(entries);
    }

    private createEntry(journal: string, num: number, date: string, account: string, label: string, debit: number, credit: number, ref: string, piece: string, aux: string = '') {
        return {
            JournalCode: journal,
            JournalLib: journal === 'VT' ? 'Ventes' : 'Achats',
            EcritureNum: num,
            EcritureDate: date,
            CompteNum: account,
            CompteLib: label.substring(0, 30), // FEC limit often around 30-40 chars
            CompteAuxNum: aux,
            CompteAuxLib: aux ? label.substring(0, 30) : '',
            PieceRef: piece,
            PieceDate: date,
            EcritureLib: label,
            MontantDebit: debit.toFixed(2).replace('.', ','),
            MontantCredit: credit.toFixed(2).replace('.', ','),
            EcritureLettrage: '',
            DateLettrage: '',
            ValidDate: date,
            MontantDevise: '',
            Idevise: ''
        };
    }

    private formatToCsv(entries: any[]): string {
        const headers = [
            'JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate',
            'CompteNum', 'CompteLib', 'CompteAuxNum', 'CompteAuxLib',
            'PieceRef', 'PieceDate', 'EcritureLib',
            'MontantDebit', 'MontantCredit',
            'EcritureLettrage', 'DateLettrage', 'ValidDate',
            'MontantDevise', 'Idevise'
        ];

        const headerRow = headers.join('\t'); // FEC expects Tab Separated? Or specialized delimiter. Standard is often Tab or | 
        // Official FEC 2013 is Tab or Pipe. Let's use Tab.

        const rows = entries.map(e => headers.map(h => e[h]).join('\t'));

        return [headerRow, ...rows].join('\r\n');
    }
}
