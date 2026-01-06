import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSubscriptionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.subscriptionPlan.findMany();
    }

    async create(data: any) {
        // Validation: Check if code exists
        const existing = await this.prisma.subscriptionPlan.findUnique({ where: { code: data.code } });
        if (existing) throw new BadRequestException('Plan code already exists');

        return this.prisma.subscriptionPlan.create({
            data: {
                code: data.code.toUpperCase(),
                name: data.name,
                priceMonthly: parseInt(data.priceMonthly),
                maxInvoices: parseInt(data.maxInvoices) || -1,
                maxUsers: parseInt(data.maxUsers) || -1,
                features: data.features || {}
            }
        });
    }

    async update(id: string, data: any) {
        return this.prisma.subscriptionPlan.update({
            where: { id },
            data: {
                name: data.name,
                priceMonthly: parseInt(data.priceMonthly),
                maxInvoices: parseInt(data.maxInvoices),
                maxUsers: parseInt(data.maxUsers),
                features: data.features
            }
        });
    }

    async delete(id: string) {
        // Check usage before delete
        const usage = await this.prisma.company.count({ where: { planId: id } });
        if (usage > 0) throw new BadRequestException(`Cannot delete plan: assigned to ${usage} companies.`);

        return this.prisma.subscriptionPlan.delete({ where: { id } });
    }
}
