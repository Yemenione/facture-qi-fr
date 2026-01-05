import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacturXGeneratorService } from './facturx-generator.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import * as crypto from 'crypto';

@Injectable()
export class InvoicesService {
    constructor(
        private prisma: PrismaService,
        private facturXService: FacturXGeneratorService
    ) { }

    async create(companyId: string, data: CreateInvoiceDto) {
        const { items, clientId } = data;

        // Calculate totals
        const totalHT = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const totalVAT = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
        const totalTTC = totalHT + totalVAT;

        return this.prisma.invoice.create({
            data: {
                companyId,
                clientId,
                subTotal: totalHT,
                taxAmount: totalVAT,
                total: totalTTC,
                seqNumber: 0, // Placeholder
                invoiceNumber: 'DRAFT',
                status: 'DRAFT',
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        vatRate: item.vatRate,
                        total: item.quantity * item.unitPrice * (1 + item.vatRate / 100)
                    }))
                }
            },
            include: { items: true }
        });
    }

    async validate(companyId: string, invoiceId: string) {
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId },
                include: { client: true, items: true }
            });

            if (!invoice) throw new NotFoundException('Facture introuvable');
            if (invoice.companyId !== companyId) throw new BadRequestException('Accès refusé');
            if (invoice.status !== 'DRAFT') throw new BadRequestException('Déjà validée');

            // Sequential Numbering Logic
            const lastInvoice = await tx.invoice.findFirst({
                where: { companyId, status: { not: 'DRAFT' } },
                orderBy: { seqNumber: 'desc' },
            });

            const nextSeq = (lastInvoice?.seqNumber || 0) + 1;
            const currentYear = new Date().getFullYear();
            const invoiceNumber = `${currentYear}-F${nextSeq.toString().padStart(4, '0')}`;

            // Anti-Fraud Chained Hash
            const prevHash = lastInvoice?.securityHash || 'GENESIS_HASH_START';
            const dataString = `${invoiceNumber}|${invoice.total}|${invoice.clientId}|${new Date().toISOString()}`;
            const securityHash = crypto
                .createHash('sha256')
                .update(dataString + prevHash)
                .digest('hex');

            const validatedInvoice = await tx.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: 'VALIDATED',
                    seqNumber: nextSeq,
                    invoiceNumber: invoiceNumber,
                    validationDate: new Date(),
                    previousHash: prevHash,
                    securityHash: securityHash,
                },
                include: { client: true, items: true }
            });

            const pdfUrl = await this.facturXService.generateAndUpload(validatedInvoice);

            return tx.invoice.update({
                where: { id: invoiceId },
                data: { pdfUrl }
            });
        });
    }
    async findAll(companyId: string) {
        return this.prisma.invoice.findMany({
            where: { companyId },
            include: { client: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(companyId: string, id: string) {
        return this.prisma.invoice.findFirst({
            where: { id, companyId },
            include: { client: true, items: true, company: true }
        });
    }
}
