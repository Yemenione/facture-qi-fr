import { Controller, Post, Get, Body, Param, UseGuards, Request, Res, NotFoundException, BadRequestException, Patch, Delete, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyScopeGuard } from '../auth/guards/company-scope.guard';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { TemplatesService } from '../templates/templates.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, CompanyScopeGuard)
export class InvoicesController {
    constructor(
        private readonly invoicesService: InvoicesService,
        private readonly pdfService: PdfService,
        private readonly mailService: MailService,
        private readonly templatesService: TemplatesService
    ) { }

    @Post()
    create(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
        const fs = require('fs');
        const logPath = 'C:\\Users\\alaza\\Desktop\\factuer fr\\apps\\api\\invoice_debug.log';
        fs.appendFileSync(logPath, `${new Date().toISOString()} - Controller Reached! Company: ${req.user.companyId}\n`);
        return this.invoicesService.create(req.user.companyId, createInvoiceDto);
    }

    @Post(':id/validate')
    validate(@Request() req, @Param('id') id: string) {
        return this.invoicesService.validate(req.user.companyId, id);
    }

    @Get()
    findAll(@Request() req, @Query('type') type?: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE') {
        return this.invoicesService.findAll(req.user.companyId, type);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.invoicesService.findOne(req.user.companyId, id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.update(req.user.companyId, id, updateInvoiceDto);
    }

    @Patch(':id/status')
    updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: 'PAID' | 'CANCELLED' | 'sent') {
        return this.invoicesService.updateStatus(req.user.companyId, id, status);
    }

    @Post(':id/convert')
    convertToInvoice(@Request() req, @Param('id') id: string) {
        return this.invoicesService.convertToInvoice(req.user.companyId, id);
    }

    @Post(':id/credit-note')
    createCreditNote(@Request() req, @Param('id') id: string) {
        return this.invoicesService.createCreditNote(req.user.companyId, id);
    }

    @Get(':id/pdf')
    async downloadPdf(@Request() req, @Param('id') id: string, @Res() res: Response) {
        const invoice = await this.invoicesService.findOne(req.user.companyId, id);
        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        const template = await this.templatesService.getDefault(req.user.companyId);
        const buffer = await this.pdfService.generateInvoice(invoice, template);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

    @Post(':id/send')
    async sendEmail(@Request() req, @Param('id') id: string) {
        const invoice = await this.invoicesService.findOne(req.user.companyId, id);
        if (!invoice) throw new NotFoundException('Invoice not found');
        if (!invoice.client || !invoice.client.email) throw new BadRequestException('Client has no email');

        // Generate PDF
        const template = await this.templatesService.getDefault(req.user.companyId);
        const buffer = await this.pdfService.generateInvoice(invoice, template);

        // Convert Uint8Array to Buffer
        const pdfBuffer = Buffer.from(buffer);

        // Send Email
        await this.mailService.sendInvoice(invoice.client.email, invoice.invoiceNumber, pdfBuffer);

        return { success: true, message: 'Email sent successfully' };
    }

    @Delete(':id')
    async delete(@Request() req, @Param('id') id: string) {
        return this.invoicesService.delete(req.user.companyId, id);
    }
}
