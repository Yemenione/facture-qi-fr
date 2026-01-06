import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminBroadcastService {
    constructor(private prisma: PrismaService) { }

    async create(data: { title: string; message: string; type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS'; isActive: boolean }) {
        return this.prisma.broadcast.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                isActive: data.isActive
            }
        });
    }

    async findAll() {
        return this.prisma.broadcast.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async delete(id: string) {
        return this.prisma.broadcast.delete({ where: { id } });
    }

    async toggleActive(id: string, isActive: boolean) {
        return this.prisma.broadcast.update({
            where: { id },
            data: { isActive }
        });
    }
}
