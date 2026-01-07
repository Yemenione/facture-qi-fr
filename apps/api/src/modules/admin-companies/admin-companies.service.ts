import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AdminAuditService } from '../admin-audit/admin-audit.service';

@Injectable()
export class AdminCompaniesService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private auditService: AdminAuditService
    ) { }

    async findAll() {
        return this.prisma.company.findMany({
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
            stripeCustomerId: c.stripeCustomerId,
            features: (c as any).features || (c.plan as any)?.features || {}, // Merge or fallback
            createdAt: c.createdAt
        })));
    }

    async impersonate(companyId: string) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: { users: true }
        });

        if (!company || company.users.length === 0) {
            throw new NotFoundException('Company or users not found');
        }

        const owner = company.users[0]; // Take first user

        const payload = {
            email: owner.email,
            sub: owner.id,
            companyId: owner.companyId,
            role: owner.role,
            isImpersonated: true
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async update(id: string, data: any) {
        const updateData: any = {};

        // 1. Handle Plan Update (Code -> ID)
        if (data.planCode) {
            const plan = await this.prisma.subscriptionPlan.findUnique({
                where: { code: data.planCode }
            });
            if (!plan) throw new BadRequestException(`Invalid plan code: ${data.planCode}`);
            updateData.planId = plan.id;
        }

        // 2. Handle simple fields
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.stripeCustomerId) updateData.stripeCustomerId = data.stripeCustomerId;

        // 3. Handle Status
        if (data.subscriptionStatus) updateData.subscriptionStatus = data.subscriptionStatus;
        if (typeof data.isActive === 'boolean') {
            updateData.subscriptionStatus = data.isActive ? 'ACTIVE' : 'SUSPENDED';
        }

        return this.prisma.company.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return this.prisma.$transaction([
            this.prisma.user.deleteMany({ where: { companyId: id } }),
            this.prisma.invoiceItem.deleteMany({ where: { invoice: { companyId: id } } }),
            this.prisma.invoice.deleteMany({ where: { companyId: id } }),
            this.prisma.client.deleteMany({ where: { companyId: id } }),
            this.prisma.product.deleteMany({ where: { companyId: id } }),
            this.prisma.invoiceTemplate.deleteMany({ where: { companyId: id } }),
            this.prisma.companySettings.deleteMany({ where: { companyId: id } }),
            this.prisma.company.delete({ where: { id } })
        ]);
    }
}
