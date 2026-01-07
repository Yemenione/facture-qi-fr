import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountantCompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string) {
        // 1. Get the Accountant User and their Firm ID
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, accountantFirmId: true }
        });

        if (!user || !user.accountantFirmId) {
            throw new NotFoundException('User is not attached to an Accountant Firm');
        }

        // 2. Fetch Companies linked to this Firm
        return this.prisma.company.findMany({
            where: { accountantFirmId: user.accountantFirmId },
            include: {
                users: true,
                invoices: { select: { id: true } },
                plan: true,
                expenses: { where: { status: 'PENDING' }, select: { id: true } }
            },
            orderBy: { createdAt: 'desc' }
        }).then(companies => companies.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            subscriptionPlan: c.plan?.code || 'UNKNOWN',
            subscriptionStatus: c.subscriptionStatus,
            isActive: c.subscriptionStatus === 'ACTIVE',
            usersCount: c.users.length,
            invoicesCount: c.invoices.length,
            documentsPendingCount: c.expenses.length,
            features: (c as any).features || (c.plan as any)?.features || {},
            createdAt: c.createdAt
        })))
    }

    async getCompanyDetails(companyId: string) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                plan: true,
                users: { select: { id: true, email: true, firstName: true, lastName: true, role: true } }
            }
        });

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        const address = company.address as any;
        const addressString = address?.street
            ? `${address.street}, ${address.city || ''} ${address.zipCode || ''}`.trim()
            : '';

        return {
            id: company.id,
            name: company.name,
            siren: company.siren,
            siret: company.siret,
            email: company.email,
            address: addressString,
            subscriptionPlan: company.plan?.code || 'UNKNOWN',
            subscriptionStatus: company.subscriptionStatus,
            users: company.users
        };
    }

    async impersonate(userId: string, companyId: string, jwtService: any) {
        // Verify ownership
        console.log(`[Impersonate] Attempting for User: ${userId} -> Company: ${companyId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: { users: true }
        });

        console.log(`[Impersonate] User Firm: ${user?.accountantFirmId} | Company Firm: ${company?.accountantFirmId}`);

        if (!user?.accountantFirmId || company?.accountantFirmId !== user.accountantFirmId) {
            console.error(`[Impersonate] Access Denied: Firms do not match or user has no firm.`);
            throw new NotFoundException('Access Denied');
        }

        if (!company || company.users.length === 0) {
            console.error(`[Impersonate] Company has no users.`);
            throw new NotFoundException('Company has no users to impersonate');
        }

        const payload = {
            email: user.email, // Keep accountant email for audit
            sub: user.id,      // Accountant ID
            companyId: company.id,
            role: 'FIRM_USER', // Special role for Accountants
            isImpersonated: true,
            impersonatedBy: userId
        };

        const token = jwtService.sign(payload, { expiresIn: '1h' });
        const clientAppUrl = process.env.CLIENT_APP_URL || 'http://localhost:3000';

        return {
            accessToken: token,
            redirectUrl: `${clientAppUrl}/auth/callback?token=${token}&from=accountant`
        };
    }

    async getUnreconciledTransactions(companyId: string) {
        return this.prisma.bankTransaction.findMany({
            where: {
                bankAccount: { companyId },
                status: 'PENDING'
            },
            take: 50,
            orderBy: { date: 'desc' }
        });
    }

    async getPendingExpenses(companyId: string) {
        return this.prisma.expense.findMany({
            where: {
                companyId,
                status: 'PENDING'
            },
            orderBy: { date: 'desc' },
            take: 50
        });
    }
}
