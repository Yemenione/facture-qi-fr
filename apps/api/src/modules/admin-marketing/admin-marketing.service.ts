import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminMarketingService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return (this.prisma as any).marketingCampaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(data: { subject: string; content: string; segment: string }) {
        // In a real scenario, this would trigger an email job queue
        // For now, we simulate sending and logging

        const campaign = await (this.prisma as any).marketingCampaign.create({
            data: {
                ...data,
                status: 'SENT', // Immediate send for now
                sentAt: new Date(),
                sentCount: await this.countSegmentUsers(data.segment)
            }
        });

        // Here we would call MailService.sendToSegment(...)

        return campaign;
    }

    private async countSegmentUsers(segment: string): Promise<number> {
        if (segment === 'ALL') return this.prisma.user.count();
        // Add more logic for ACTIVE/PRO later
        return 0;
    }
}
