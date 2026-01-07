import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FacturXXmlService } from './factur-x-xml.service';

@Module({
    providers: [PdfService, FacturXXmlService],
    exports: [PdfService, FacturXXmlService],
})
export class PdfModule { }
