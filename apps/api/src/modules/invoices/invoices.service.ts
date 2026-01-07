import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceCalculator } from './invoice-calculator';
import * as crypto from 'crypto';

@Injectable()
export class InvoicesService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(companyId: string, data: CreateInvoiceDto) {
        try {
            console.log("Creating invoice/quote for company:", companyId);
            const { items, clientId } = data;

            // Use Calculator Engine
            const totals = InvoiceCalculator.calculateInvoice(items);

            // Determine prefix based on type
            const prefix = data.type === 'QUOTE' ? 'DEVIS' : 'DRAFT';

            // Force cast to any to bypass TS error temporarily
            return await this.prisma.invoice.create({
                data: {
                    companyId,
                    clientId,
                    subTotal: totals.totalHT,
                    taxAmount: totals.totalVAT,
                    total: totals.totalTTC,
                    seqNumber: 0,
                    invoiceNumber: `${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
                    status: 'DRAFT', // Quotes start as DRAFT too
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

            if (!invoice) throw new NotFoundException('Document introuvable');
            if (invoice.companyId !== companyId) throw new BadRequestException('Accès refusé');
            if (invoice.status !== 'DRAFT') throw new BadRequestException('Déjà validée');

            // Sequential Numbering Logic
            // SEPARATE SEQUENCE FOR QUOTES vs INVOICES
            const lastDocument = await tx.invoice.findFirst({
                where: {
                    companyId,
                    type: invoice.type,
                    status: { not: 'DRAFT' }
                },
                orderBy: { seqNumber: 'desc' },
            });

            const nextSeq = (lastDocument?.seqNumber || 0) + 1;
            const currentYear = new Date().getFullYear();

            let documentNumber = '';
            if (invoice.type === 'QUOTE') {
                documentNumber = `D-${currentYear}-${nextSeq.toString().padStart(4, '0')}`;
            } else if (invoice.type === 'CREDIT_NOTE') {
                documentNumber = `AV-${currentYear}-${nextSeq.toString().padStart(4, '0')}`;
            } else {
                documentNumber = `${currentYear}-F${nextSeq.toString().padStart(4, '0')}`;
            }

            // Anti-Fraud Chained Hash (Only strictly required for Invoices/Credit Notes, but good for data integrity)
            const prevHash = lastDocument?.securityHash || 'GENESIS_HASH_START';
            const dataString = `${documentNumber}|${invoice.total}|${invoice.clientId}|${new Date().toISOString()}`;
            const securityHash = crypto
                .createHash('sha256')
                .update(dataString + prevHash)
                .digest('hex');

            const validatedInvoice = await tx.invoice.update({
                where: { id: invoiceId },
                data: {
                    status: 'VALIDATED',
                    seqNumber: nextSeq,
                    invoiceNumber: documentNumber,
                    validationDate: new Date(),
                    previousHash: prevHash,
                    securityHash: securityHash,
                },
                include: { client: true, items: true }
            });

            // Generate PDF (Factur-X only for Invoices)
            // For Quotes, we might use a different generator or same one adapted
            const pdfUrl = `https://mock-s3.com/invoices/${validatedInvoice.invoiceNumber}.pdf`;

            return tx.invoice.update({
                where: { id: invoiceId },
                data: { pdfUrl }
            });
        });
    }

    async findAll(companyId: string, type?: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE') {
        return this.prisma.invoice.findMany({
            where: {
                companyId,
                ...(type && { type }) // Filter by type if provided
            },
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

    async convertToInvoice(companyId: string, quoteId: string) {
        const quote = await this.findOne(companyId, quoteId);
        if (!quote) throw new NotFoundException('Devis introuvable');
        if (quote.type !== 'QUOTE') throw new BadRequestException('Ce document n\'est pas un devis');

        const createInvoiceDto: CreateInvoiceDto = {
            clientId: quote.clientId,
            type: 'INVOICE',
            items: quote.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                vatRate: item.vatRate
            }))
        };

        return this.create(companyId, createInvoiceDto);
    }

    async createCreditNote(companyId: string, invoiceId: string) {
        const invoice = await this.findOne(companyId, invoiceId);
        if (!invoice) throw new NotFoundException('Facture introuvable');
        if (invoice.type !== 'INVOICE') throw new BadRequestException('Impossible de créer un avoir sur ce type de document');
        if (invoice.status === 'DRAFT') throw new BadRequestException('La facture doit être validée avant de créer un avoir');

        // Create Credit Note DTO
        // Usually Credit Notes have same positive values but Type=CREDIT_NOTE
        const createInvoiceDto: CreateInvoiceDto = {
            clientId: invoice.clientId,
            type: 'CREDIT_NOTE',
            notes: `Avoir sur la facture Ref: ${invoice.invoiceNumber}`,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                vatRate: item.vatRate
            }))
        };

        return this.create(companyId, createInvoiceDto);
    }
}
