import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Invoice, Company, Client, InvoiceItem } from '@prisma/client';

type FullInvoice = Invoice & {
    company: Company & {
        siret?: string;
        capital?: string;
        rcs?: string;
        iban?: string;
        bic?: string;
        legalMentions?: string;
        penalties?: string;
        logoUrl?: string;
        phone?: string;
    };
    client: Client;
    items: InvoiceItem[];
};

@Injectable()
export class PdfService {
    async generateInvoice(invoice: FullInvoice): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const drawText = (text: string, x: number, y: number, size = 10, isBold = false) => {
            page.drawText(text || '', {
                x,
                y,
                size,
                font: isBold ? fontBold : font,
                color: rgb(0, 0, 0),
            });
        };

        // Header - Company Info
        let y = height - 50;

        // Draw Logo if exists (Simplified placeholder text for now, would need image embedding logic)
        if (invoice.company.logoUrl) {
            // Would normally fetch and embed image here. 
            // For now, draw text indicating logo area or just rely on company name
        }

        drawText(invoice.company.name, 50, y, 20, true);
        y -= 25;
        drawText(invoice.company.email || '', 50, y);
        y -= 15;
        // Check if address is object or string (json field in prisma)
        const address: any = invoice.company.address;
        const addressStr = typeof address === 'string' ? address : `${address?.street || ''}, ${address?.city || ''}`;
        drawText(addressStr, 50, y);
        y -= 15;
        if (invoice.company.phone) {
            drawText(`Tel: ${invoice.company.phone}`, 50, y);
            y -= 15;
        }

        // Legal Info Header
        let legalY = y - 10;
        const legalInfo = [
            invoice.company.siret ? `SIRET: ${invoice.company.siret}` : '',
            invoice.company.vatNumber ? `TVA: ${invoice.company.vatNumber}` : '',
            invoice.company.rcs ? `RCS: ${invoice.company.rcs}` : '',
            invoice.company.capital ? `Capital: ${invoice.company.capital} €` : ''
        ].filter(Boolean).join(' - ');

        if (legalInfo) {
            drawText(legalInfo, 50, legalY, 8);
        }

        y -= 30;

        // Invoice Details
        drawText(`FACTURE N° ${invoice.invoiceNumber}`, 400, height - 50, 15, true);
        drawText(`Date: ${new Date(invoice.issueDate).toLocaleDateString('fr-FR')}`, 400, height - 70);
        drawText(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, 400, height - 85);

        // Client Info
        y = height - 160;
        drawText("FACTURER À:", 50, y, 12, true);
        y -= 20;
        drawText(invoice.client.name, 50, y, 12, true);
        y -= 15;
        const clientAddr: any = invoice.client.address;
        if (clientAddr) {
            drawText(typeof clientAddr === 'string' ? clientAddr : `${clientAddr.street || ''}`, 50, y);
            y -= 15;
            drawText(typeof clientAddr === 'string' ? '' : `${clientAddr.zip || ''} ${clientAddr.city || ''}`, 50, y);
        }

        // Items Table Header
        y = height - 250;
        // Background for header
        page.drawRectangle({ x: 40, y: y - 5, width: width - 80, height: 20, color: rgb(0.9, 0.9, 0.9) });

        drawText("Description", 50, y, 10, true);
        drawText("Qté", 300, y, 10, true);
        drawText("Prix U.", 350, y, 10, true);
        drawText("Total HT", 450, y, 10, true);

        y -= 20;

        // Items
        let subtotal = 0;
        invoice.items.forEach(item => {
            const total = item.quantity * item.unitPrice;
            subtotal += total;

            drawText(item.description, 50, y);
            drawText(item.quantity.toString(), 300, y);
            drawText(`${item.unitPrice.toFixed(2)} €`, 350, y);
            drawText(`${total.toFixed(2)} €`, 450, y);

            y -= 20;
        });

        // Totals
        const vatRate = 0.20; // Hardcoded for simplified example, ideally per item or global setting
        const vatAmount = subtotal * vatRate;
        const totalTTC = subtotal + vatAmount;

        y -= 20;
        drawText("-----------------------------------------------", 300, y);
        y -= 20;

        drawText("Total HT:", 350, y);
        drawText(`${subtotal.toFixed(2)} €`, 450, y);
        y -= 20;

        drawText("TVA (20%):", 350, y);
        drawText(`${vatAmount.toFixed(2)} €`, 450, y);
        y -= 20;

        drawText("Total TTC:", 350, y, 12, true);
        drawText(`${totalTTC.toFixed(2)} €`, 450, y, 12, true);


        // Footer
        drawText("Merci de votre confiance !", 50, 50, 10, true);
        drawText(`SIREN: ${invoice.company.siren || 'Non renseigné'}`, 50, 35, 8);

        return pdfDoc.save();
    }
}
