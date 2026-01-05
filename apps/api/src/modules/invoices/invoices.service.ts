import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacturXGeneratorService } from './facturx-generator.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceCalculator } from './invoice-calculator';
import * as crypto from 'crypto';

@Injectable()
export class InvoicesService {
    constructor(
        private prisma: PrismaService,
        private facturXService: FacturXGeneratorService
    ) { }

    async create(companyId: string, data: CreateInvoiceDto) {
        try {
            console.log("Creating invoice for company:", companyId); // Entry log
            const { items, clientId } = data;

            // Use Calculator Engine
            const totals = InvoiceCalculator.calculateInvoice(items);

            // Force cast to any to bypass TS error temporarily
            return await this.prisma.invoice.create({
                data: {
                    companyId,
                    clientId,
                    subTotal: totals.totalHT,
                    taxAmount: totals.totalVAT,
                    total: totals.totalTTC,
                    seqNumber: 0,
                    invoiceNumber: `DRAFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    status: 'DRAFT',
                    type: data.type || 'INVOICE',
                    validityDate: data.validityDate ? new Date(data.validityDate) : undefined,
                    items: {
                        create: items.map(item => {
                            const line = InvoiceCalculator.calculateLine(item.quantity, item.unitPrice, item.vatRate);
                            return {
                                description: item.description,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                vatRate: item.vatRate,
                                total: line.totalHT
                            }
                        })
                    }
                },
                include: { items: true }
            });
        } catch (error) {
            console.error("Invoice Creation Error:", error);
            const fs = require('fs');
            const logPath = 'C:\\Users\\alaza\\Desktop\\factuer fr\\apps\\api\\invoice_debug.log';
            fs.appendFileSync(logPath, `${new Date().toISOString()} [由于] Payload: ${JSON.stringify(data)} \n Error: ${error.message} - ${JSON.stringify(error)}\n\n`);
            throw error;
        }
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

    async update(companyId: string, id: string, data: CreateInvoiceDto) {
        // Recalculate everything
        const { items, clientId } = data;
        const totals = InvoiceCalculator.calculateInvoice(items);

        // Transaction to update invoice and replace items
        return this.prisma.$transaction(async (tx) => {
            // 1. Delete old items
            await tx.invoiceItem.deleteMany({
                where: { invoiceId: id }
            });

            // 2. Update Invoice + Create new items
            return tx.invoice.update({
                where: { id, companyId },
                data: {
                    clientId,
                    subTotal: totals.totalHT,
                    taxAmount: totals.totalVAT,
                    total: totals.totalTTC,
                    type: data.type || 'INVOICE',
                    status: 'DRAFT',
                    validityDate: data.validityDate ? new Date(data.validityDate) : undefined,
                    issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
                    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                    items: {
                        create: items.map(item => {
                            const line = InvoiceCalculator.calculateLine(item.quantity, item.unitPrice, item.vatRate);
                            return {
                                description: item.description,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                vatRate: item.vatRate,
                                total: line.totalHT
                            }
                        })
                    }
                },
                include: { items: true }
            });
        });
    }

    async updateStatus(companyId: string, id: string, status: 'PAID' | 'CANCELLED' | 'sent') {
        // Simple status update for now. 
        // In real world, 'PAID' might trigger accounting entries.
        return this.prisma.invoice.update({
            where: { id, companyId },
            data: { status: status as any }
        });
    }

    async findOne(companyId: string, id: string) {
        return this.prisma.invoice.findFirst({
            where: { id, companyId },
            include: { client: true, items: true, company: true }
        });
    }

    async delete(companyId: string, id: string) {
        // Verify ownership
        const invoice = await this.prisma.invoice.findFirst({
            where: { id, companyId }
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        // Only allow deletion of DRAFT invoices
        if (invoice.status !== 'DRAFT') {
            throw new BadRequestException('Cannot delete validated invoices');
        }

        // Delete invoice items first, then invoice
        await this.prisma.invoiceItem.deleteMany({
            where: { invoiceId: id }
        });

        return this.prisma.invoice.delete({
            where: { id }
        });
    }
}
