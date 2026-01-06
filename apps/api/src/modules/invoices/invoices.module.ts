import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FacturXGeneratorService } from './facturx-generator.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
    imports: [PdfModule, MailModule, TemplatesModule],
    controllers: [InvoicesController],
    providers: [InvoicesService, FacturXGeneratorService, PrismaService],
})
export class InvoicesModule { }
