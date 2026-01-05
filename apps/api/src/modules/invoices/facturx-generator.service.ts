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
        const { width, height } = page.getSize();
        const fontSize = 10;

        // --- Header ---
        page.drawText(inv.company?.name || 'Ma Société', { x: 50, y: height - 50, size: 20 });
        page.drawText(inv.company?.email || 'contact@company.com', { x: 50, y: height - 70, size: 10 });

        // --- Client Info ---
        page.drawText('Facturer à:', { x: 400, y: height - 50, size: 12 });
        page.drawText(inv.client?.name || 'Client Inconnu', { x: 400, y: height - 70, size: 10 });
        page.drawText(inv.client?.email || '', { x: 400, y: height - 85, size: 10 });

        // --- Invoice Meta ---
        page.drawText(`FACTURE N° ${inv.invoiceNumber}`, { x: 50, y: height - 120, size: 14 });
        page.drawText(`Date: ${new Date(inv.issueDate).toLocaleDateString('fr-FR')}`, { x: 50, y: height - 140, size: 10 });

        // --- Table Headers ---
        const tableTop = height - 200;
        page.drawText('Description', { x: 50, y: tableTop, size: 10 });
        page.drawText('Qté', { x: 300, y: tableTop, size: 10 });
        page.drawText('Prix U. HT', { x: 350, y: tableTop, size: 10 });
        page.drawText('Total HT', { x: 450, y: tableTop, size: 10 });

        page.drawLine({
            start: { x: 50, y: tableTop - 5 },
            end: { x: 550, y: tableTop - 5 },
            thickness: 1,
        });

        // --- Items ---
        let yPosition = tableTop - 25;
        inv.items.forEach((item: any) => {
            page.drawText(item.description.substring(0, 40), { x: 50, y: yPosition, size: 10 });
            page.drawText(item.quantity.toString(), { x: 300, y: yPosition, size: 10 });
            page.drawText(item.unitPrice.toFixed(2), { x: 350, y: yPosition, size: 10 });
            page.drawText((item.quantity * item.unitPrice).toFixed(2), { x: 450, y: yPosition, size: 10 });
            yPosition -= 20;
        });

        // --- Totals ---
        const totalY = yPosition - 30;
        page.drawText(`Total HT: ${inv.subTotal.toFixed(2)} €`, { x: 400, y: totalY, size: 12 });
        page.drawText(`TVA: ${inv.taxAmount.toFixed(2)} €`, { x: 400, y: totalY - 20, size: 12 });
        page.drawText(`Total TTC: ${inv.total.toFixed(2)} €`, { x: 400, y: totalY - 40, size: 14 });

        // --- Footer ---
        page.drawText('Merci de votre confiance.', { x: 50, y: 50, size: 10 });
        page.drawText('Généré par Invoicer FR - Conforme Factur-X 2026', { x: 50, y: 30, size: 8, opacity: 0.5 });

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
