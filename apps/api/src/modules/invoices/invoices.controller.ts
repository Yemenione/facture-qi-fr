import { Controller, Post, Get, Body, Param, UseGuards, Request, Res, NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyScopeGuard } from '../auth/guards/company-scope.guard';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, CompanyScopeGuard)
export class InvoicesController {
    constructor(
        private readonly invoicesService: InvoicesService,
        private readonly pdfService: PdfService
    ) { }

    @Post()
    create(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(req.user.companyId, createInvoiceDto);
    }

    @Post(':id/validate')
    validate(@Request() req, @Param('id') id: string) {
        return this.invoicesService.validate(req.user.companyId, id);
    }

    @Get()
    findAll(@Request() req) {
        return this.invoicesService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.invoicesService.findOne(req.user.companyId, id);
    }
}
