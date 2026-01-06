import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DunningService {
    constructor(private prisma: PrismaService) { }

    async getOverdueInvoices(companyId: string) {
        const now = new Date();
        return this.prisma.invoice.findMany({
            where: {
                companyId,
                status: { in: ['VALIDATED', 'PARTIALLY_PAID', 'OVERDUE'] },
                dueDate: { lt: now }, // Due date is in the past
            },
            include: {
                client: {
                    select: { name: true, email: true, phone: true }
                }
            },
            orderBy: { dueDate: 'asc' }
        });
    }

    async remind(companyId: string, invoiceId: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId, companyId }
        });

        if (!invoice) throw new NotFoundException('Invoice not found');

        // Simulate sending email (Implementation would go here)
        console.log(`[DUNNING] Sending reminder email for invoice ${invoice.invoiceNumber} to client`);

        // Update invoice state
        return this.prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                reminderLevel: { increment: 1 },
                lastReminderDate: new Date(),
                status: 'OVERDUE' // Force status to OVERDUE if it wasn't already
            }
        });
    }
}
