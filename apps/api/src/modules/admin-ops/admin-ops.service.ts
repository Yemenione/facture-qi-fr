import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminOpsService {
    constructor(private prisma: PrismaService) { }

    async getSystemBackup() {
        const timestamp = new Date().toISOString();
        const [companies, users, invoices] = await Promise.all([
            this.prisma.company.findMany(),
            this.prisma.user.findMany(),
            this.prisma.invoice.findMany(),
        ]);

        return {
            meta: {
                timestamp,
                version: '1.0.0',
                totalCompanies: companies.length,
                totalUsers: users.length,
                totalInvoices: invoices.length,
            },
            data: {
                companies,
                users,
                invoices
            }
        };
    }
}
