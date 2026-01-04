import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FacturXGeneratorService } from './facturx-generator.service';

@Module({
    controllers: [InvoicesController],
    providers: [InvoicesService, FacturXGeneratorService],
})
export class InvoicesModule { }
