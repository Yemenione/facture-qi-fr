import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { create } from 'xmlbuilder2';

@Injectable()
export class FacturXGeneratorService {

    async generateAndUpload(invoice: any) {
        // 1. Generate Visual PDF (Simulation)
        const pdfBuffer = await this.generateVisualPdf(invoice);

        // 2. Create XML Factur-X (CII standard)
        const xmlContent = this.buildFacturXXML(invoice);

        // 3. Attach XML to PDF (PDF/A-3 Compliant)
        const finalPdfBuffer = await this.attachXmlToPdf(pdfBuffer, xmlContent);

        // 4. Upload S3 (Mock)
        const fileUrl = await this.mockUploadS3(finalPdfBuffer, `invoices/${invoice.invoiceNumber}.pdf`);

        return fileUrl;
    }

    private buildFacturXXML(invoice: any): string {
        const xml = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('rsm:CrossIndustryInvoice', {
                'xmlns:rsm': 'urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100',
                'xmlns:ram': 'urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100',
                'xmlns:udt': 'urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100',
            })
            .ele('rsm:ExchangedDocumentContext')
            .ele('ram:GuidelineSpecifiedDocumentContextParameter')
            .ele('ram:ID').txt('urn:factur-x.eu:1p0:minimum').up()
            .up()
            .up()
            .ele('rsm:ExchangedDocument')
            .ele('ram:ID').txt(invoice.invoiceNumber).up()
            .ele('ram:TypeCode').txt('380').up()
            .ele('ram:IssueDateTime')
            .ele('udt:DateTimeString', { format: '102' }).txt(this.formatDate(invoice.issueDate)).up()
            .up()
            .up()
            .up();

        return xml.end({ prettyPrint: true });
    }

    private async attachXmlToPdf(pdfBuffer: Buffer, xmlContent: string): Promise<Buffer> {
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        await pdfDoc.attach(Buffer.from(xmlContent), 'factur-x.xml', {
            mimeType: 'text/xml',
            description: 'Factur-X XML Data',
            creationDate: new Date(),
            modificationDate: new Date(),
        });

        return Buffer.from(await pdfDoc.save());
    }

    private async generateVisualPdf(inv: any): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText(`FACTURE N° ${inv.invoiceNumber}`, { x: 50, y: 700 });
        page.drawText(`MONTANT TTC: ${inv.total} EUR`, { x: 50, y: 650 });
        return Buffer.from(await pdfDoc.save());
    }

    private formatDate(date: Date): string {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
    }

    private async mockUploadS3(buffer: Buffer, key: string): Promise<string> {
        console.log(`[S3] Uploading ${key} (${buffer.length} bytes)...`);
        return `https://s3.aws.com/my-bucket/${key}`;
    }
}
