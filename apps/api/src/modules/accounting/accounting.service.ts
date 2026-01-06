import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountingService {
    constructor(private prisma: PrismaService) { }

    async getStats(companyId: string, year: number) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const invoices = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PAID'] },
                issueDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                items: true
            }
        });

        // Initialize monthly data
        const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            revenue: 0,
            vat: 0,
            invoiceCount: 0
        }));

        let totalRevenue = 0;
        let totalVat = 0;

        for (const invoice of invoices) {
            const monthIndex = invoice.issueDate.getMonth(); // 0-11

            // If Credit Note, subtract. If Invoice, add.
            const multiplier = invoice.type === 'CREDIT_NOTE' ? -1 : 1;

            const amountHT = (invoice.subTotal || 0) * multiplier;
            const amountVAT = (invoice.taxAmount || 0) * multiplier;

            monthlyStats[monthIndex].revenue += amountHT;
            monthlyStats[monthIndex].vat += amountVAT;
            monthlyStats[monthIndex].invoiceCount += 1;

            totalRevenue += amountHT;
            totalVat += amountVAT;
        }

        return {
            year,
            totalRevenue,
            totalVat,
            monthlyStats
        };
    }

    async getJournal(companyId: string, limit = 50) {
        return this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PAID'] }
            },
            orderBy: { issueDate: 'desc' },
            take: limit,
            select: {
                id: true,
                invoiceNumber: true,
                issueDate: true,
                client: { select: { name: true } },
                total: true,
                subTotal: true,
                taxAmount: true,
                type: true
            }
        });
    }
}
