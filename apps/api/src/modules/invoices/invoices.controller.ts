import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyScopeGuard } from '../auth/guards/company-scope.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard, CompanyScopeGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    create(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(req.user.companyId, createInvoiceDto);
    }

    @Post(':id/validate')
    validate(@Request() req, @Param('id') id: string) {
        return this.invoicesService.validate(req.user.companyId, id);
    }
}
