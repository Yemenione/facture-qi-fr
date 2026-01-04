import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats(companyId: string): Promise<DashboardStatsDto> {
        // 1. Calculate Total Revenue (PAID Invoices)
        // Adjust status 'PAID' based on your Enum. Using raw strings for safety if Enum import issues arise.
        const headerRows = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: 'PAID',
            },
            select: { total: true }
        });
        const totalRevenue = headerRows.reduce((sum, inv) => sum + inv.total, 0);

        // 2. Pending Revenue (SENT/DRAFT?) - Let's say invoices that are validated but not paid
        const pendingRows = await this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PARTIALLY_PAID', 'OVERDUE'] }
            },
            select: { total: true }
        });
        const pendingRevenue = pendingRows.reduce((sum, inv) => sum + inv.total, 0);

        // 3. Counts
        const invoicesCount = await this.prisma.invoice.count({ where: { companyId } });
        const clientsCount = await this.prisma.client.count({ where: { companyId } });

        // 4. Recent Activity (Last 5 invoices)
        const recentInvoices = await this.prisma.invoice.findMany({
            where: { companyId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { client: { select: { name: true } } },
        });

        return {
            totalRevenue,
            pendingRevenue,
            invoicesCount,
            clientsCount,
            recentInvoices,
        };
    }
}
