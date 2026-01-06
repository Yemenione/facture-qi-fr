
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FecService {
    constructor(private readonly prisma: PrismaService) { }

    async generateFec(companyId: string, year: number) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        // Fetch validated invoices for the period
        const invoices = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PAID'] }, // Only finalized invoices
                issueDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                client: true
            },
            orderBy: {
                invoiceNumber: 'asc'
            }
        });

        const entries: string[] = [];
        // Header line as per Article A47 A-1
        entries.push([
            'JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate', 'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib', 'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit', 'EcritureLet', 'DateLet', 'ValidDate', 'MontantDevise', 'Idevise'
        ].join('\t')); // Tab separated is standard

        let seqEcriture = 1;

        for (const invoice of invoices) {
            const isCreditNote = invoice.type === 'CREDIT_NOTE';
            const journalCode = 'VT'; // Ventes
            const journalLib = 'Journal des Ventes';
            const pieceRef = invoice.invoiceNumber;
            const pieceDate = invoice.issueDate.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const ecritureDate = pieceDate;
            const validDate = invoice.createdAt.toISOString().slice(0, 10).replace(/-/g, '');
            const clientName = invoice.client.name.substring(0, 30); // Truncate if too long

            // 1. Client Line (Debit for Invoice, Credit for Credit Note)
            // Account 411
            entries.push(this.formatLine({
                JournalCode: journalCode,
                JournalLib: journalLib,
                EcritureNum: seqEcriture,
                EcritureDate: ecritureDate,
                CompteNum: '411000',
                CompteLib: 'Clients - Ventes de biens et services',
                CompAuxNum: invoice.client.id.substring(0, 10), // Use ID or custom code
                CompAuxLib: clientName,
                PieceRef: pieceRef,
                PieceDate: pieceDate,
                EcritureLib: `Facture ${pieceRef} - ${clientName}`,
                Debit: isCreditNote ? 0 : invoice.total,
                Credit: isCreditNote ? invoice.total : 0,
                ValidDate: validDate
            }));

            // 2. Sales Revenue (Credit for Invoice, Debit for Credit Note)
            // Account 706 (Prestations de services - assuming SaaS)
            entries.push(this.formatLine({
                JournalCode: journalCode,
                JournalLib: journalLib,
                EcritureNum: seqEcriture,
                EcritureDate: ecritureDate,
                CompteNum: '706000',
                CompteLib: 'Prestations de services',
                PieceRef: pieceRef,
                PieceDate: pieceDate,
                EcritureLib: `Facture ${pieceRef} - ${clientName}`,
                Debit: isCreditNote ? invoice.subTotal : 0,
                Credit: isCreditNote ? 0 : invoice.subTotal,
                ValidDate: validDate
            }));

            // 3. VAT (Credit for Invoice, Debit for Credit Note)
            // Account 44571
            if (invoice.taxAmount > 0) {
                entries.push(this.formatLine({
                    JournalCode: journalCode,
                    JournalLib: journalLib,
                    EcritureNum: seqEcriture,
                    EcritureDate: ecritureDate,
                    CompteNum: '445710',
                    CompteLib: 'TVA collectée',
                    PieceRef: pieceRef,
                    PieceDate: pieceDate,
                    EcritureLib: `TVA sur Facture ${pieceRef}`,
                    Debit: isCreditNote ? invoice.taxAmount : 0,
                    Credit: isCreditNote ? 0 : invoice.taxAmount,
                    ValidDate: validDate
                }));
            }

            seqEcriture++;
        }

        return entries.join('\r\n');
    }

    private formatLine(data: any) {
        // Ensure strictly 18 columns, standard format
        const cols = [
            data.JournalCode,
            data.JournalLib,
            data.EcritureNum,
            data.EcritureDate,
            data.CompteNum,
            data.CompteLib,
            data.CompAuxNum || '',
            data.CompAuxLib || '',
            data.PieceRef,
            data.PieceDate,
            data.EcritureLib,
            data.Debit.toFixed(2).replace('.', ','), // French format
            data.Credit.toFixed(2).replace('.', ','), // French format
            '', // EcritureLet
            '', // DateLet
            data.ValidDate,
            '', // MontantDevise
            ''  // Idevise
        ];
        return cols.join('\t');
    }
}
