import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAuditService {
    constructor(private prisma: PrismaService) { }

    async log(actorId: string, action: string, targetId?: string, metadata?: any, ipAddress?: string) {
        // Safe logging - don't crash if logging fails
        try {
            await (this.prisma as any).auditLog.create({
                data: {
                    actorId,
                    action,
                    targetId,
                    metadata: metadata || {},
                    ipAddress
                }
            });
        } catch (e) {
            console.error('Failed to create audit log', e);
        }
    }

    async findAll() {
        return (this.prisma as any).auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to last 100 actions for performance
        });
    }
}
