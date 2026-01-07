import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

import { PrismaService } from '../../prisma/prisma.service';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { TemplatesModule } from '../templates/templates.module';

import { DataOpsModule } from '../data-ops/data-ops.module';

@Module({
    imports: [PdfModule, MailModule, TemplatesModule, DataOpsModule],
    controllers: [InvoicesController],
    providers: [InvoicesService, PrismaService],
})
export class InvoicesModule { }
