
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountantStatsService {
    constructor(private prisma: PrismaService) { }

    async getCockpitStats(firmId: string) {
        // 1. Fetch all companies for this firm
        const companies = await this.prisma.company.findMany({
            where: { accountantFirmId: firmId },
            include: {
                plan: true,
                expenses: {
                    where: { status: 'PENDING' },
                    select: { id: true, proofUrl: true }
                }
            }
        });

        // 2. Transform into Cockpit Data
        return companies.map((c) => {
            const missingReceipts = c.expenses.filter(e => !e.proofUrl).length;
            const pendingValidation = c.expenses.length;

            return {
                id: c.id,
                name: c.name,
                siret: c.siret,
                plan: c.plan?.code,
                isActive: c.subscriptionStatus === 'ACTIVE',

                // Météo / Health
                financials: {
                    bankBalance: 12500.00, // Mock for now
                    cashFlowTrend: 'stable' as const,
                },

                // To-Do / Workpile
                todo: {
                    missingReceipts,
                    pendingValidation,
                    unreconciledBank: 0,
                    overdueInvoices: 0
                },

                // Compliance
                compliance: {
                    tvaStatus: 'OK',
                    tvaNextDue: '2026-02-15',
                    fecStatus: 'READY'
                }
            };
        });
    }
}
