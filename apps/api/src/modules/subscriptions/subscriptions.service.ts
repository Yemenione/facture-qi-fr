import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.subscriptionPlan.findMany({
            orderBy: { priceMonthly: 'asc' }
        });
    }
}
