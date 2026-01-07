import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async getDocumentsByCompany(companyId: string) {
        // For now, we'll return invoices and expenses as documents
        const [invoices, expenses] = await Promise.all([
            this.prisma.invoice.findMany({
                where: { companyId },
                select: {
                    id: true,
                    invoiceNumber: true,
                    createdAt: true,
                    total: true,
                    client: {
                        select: { name: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 50
            }),
            this.prisma.expense.findMany({
                where: { companyId },
                select: {
                    id: true,
                    description: true,
                    supplier: true,
                    date: true,
                    amount: true,
                    proofUrl: true
                },
                orderBy: { date: 'desc' },
                take: 50
            })
        ]);

        // Transform to unified document format
        const documents = [
            ...invoices.map(inv => ({
                id: inv.id,
                name: `Facture ${inv.invoiceNumber}`,
                type: 'pdf',
                category: 'Factures',
                size: '~150 KB',
                uploadedAt: inv.createdAt.toISOString(),
                companyName: inv.client.name,
                metadata: {
                    amount: inv.total,
                    type: 'invoice'
                }
            })),
            ...expenses.map(exp => ({
                id: exp.id,
                name: `${exp.supplier || exp.description || 'Dépense'} - ${new Date(exp.date).toLocaleDateString('fr-FR')}`,
                type: exp.proofUrl ? exp.proofUrl.split('.').pop() || 'pdf' : 'pdf',
                category: 'Justificatifs',
                size: '~200 KB',
                uploadedAt: exp.date.toISOString(),
                companyName: exp.supplier || 'N/A',
                metadata: {
                    amount: exp.amount,
                    type: 'expense',
                    url: exp.proofUrl
                }
            }))
        ];

        return documents.sort((a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
    }

    async getAllDocumentsForAccountant(accountantFirmId: string) {
        // Get all companies for this accountant
        const companies = await this.prisma.company.findMany({
            where: { accountantFirmId },
            select: { id: true, name: true }
        });

        const allDocuments = [];

        for (const company of companies) {
            const docs = await this.getDocumentsByCompany(company.id);
            allDocuments.push(...docs.map(doc => ({
                ...doc,
                companyName: company.name
            })));
        }

        return allDocuments.sort((a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
    }

    async getDocumentStats(accountantFirmId: string) {
        const companies = await this.prisma.company.findMany({
            where: { accountantFirmId },
            select: { id: true }
        });

        const companyIds = companies.map(c => c.id);

        const [invoiceCount, expenseCount] = await Promise.all([
            this.prisma.invoice.count({
                where: { companyId: { in: companyIds } }
            }),
            this.prisma.expense.count({
                where: { companyId: { in: companyIds } }
            })
        ]);

        return {
            total: invoiceCount + expenseCount,
            invoices: invoiceCount,
            expenses: expenseCount,
            byCategory: {
                'Factures': invoiceCount,
                'Justificatifs': expenseCount,
                'Juridique': 0,
                'Contrats': 0,
                'Autres': 0
            }
        };
    }
}
