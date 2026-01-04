import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        // Fetch companies with some stats
        const companies = await this.prisma.company.findMany({
            include: {
                _count: {
                    select: { invoices: true, users: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        return companies.map(c => ({
            ...c,
            invoicesCount: c._count.invoices,
            usersCount: c._count.users,
        }));
    }
}
