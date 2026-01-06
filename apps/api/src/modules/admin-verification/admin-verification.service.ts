import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminVerificationService {
    constructor(private prisma: PrismaService) { }

    async findAllPending() {
        return this.prisma.company.findMany({
            where: {
                verificationStatus: 'PENDING'
            },
            include: {
                users: {
                    where: { role: 'OWNER' },
                    select: { email: true, firstName: true, lastName: true }
                }
            }
        });
    }

    async approve(id: string) {
        return this.prisma.company.update({
            where: { id },
            data: { verificationStatus: 'VERIFIED' }
        });
    }

    async reject(id: string) {
        return this.prisma.company.update({
            where: { id },
            data: { verificationStatus: 'REJECTED' }
        });
    }
}
