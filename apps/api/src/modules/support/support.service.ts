import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    // --- Client Methods ---
    async createTicket(userId: string, data: { subject: string; message: string; priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }) {
        return this.prisma.ticket.create({
            data: {
                userId,
                subject: data.subject,
                priority: data.priority || 'MEDIUM',
                messages: {
                    create: {
                        content: data.message,
                        isAdmin: false
                    }
                }
            }
        });
    }

    async getMyTickets(userId: string) {
        return this.prisma.ticket.findMany({
            where: { userId },
            include: { messages: true },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async replyToTicket(ticketId: string, userId: string, content: string) {
        // Ensure user owns ticket
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket || ticket.userId !== userId) throw new NotFoundException('Ticket not found');

        return this.prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: 'OPEN', // Re-open if closed
                updatedAt: new Date(),
                messages: {
                    create: { content, isAdmin: false }
                }
            }
        });
    }

    // --- Admin Methods ---
    async getAllTickets() {
        return this.prisma.ticket.findMany({
            include: {
                user: { select: { email: true, firstName: true, lastName: true, company: { select: { name: true } } } },
                messages: { orderBy: { createdAt: 'asc' } }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async adminReply(ticketId: string, content: string, newStatus?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') {
        return this.prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: newStatus || 'IN_PROGRESS',
                updatedAt: new Date(),
                messages: {
                    create: { content, isAdmin: true }
                }
            }
        });
    }
}
