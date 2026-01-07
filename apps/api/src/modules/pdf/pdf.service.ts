import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { Invoice, Company, Client, InvoiceItem, InvoiceTemplate } from '@prisma/client';
import { FacturXXmlService } from './factur-x-xml.service';

// Helper to convert hex to PDF RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    return result ? rgb(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ) : rgb(0, 0, 0);
};

type FullInvoice = Invoice & {
    company: Company & {
        siret?: string;
        capital?: string;
        rcs?: string;
        iban?: string;
        bic?: string;
        legalMentions?: string;
        penalties?: string;
        logoUrl?: string; // API URL
        phone?: string;
        vatNumber?: string;
        address?: any;
    };
    client: Client & {
        siret?: string;
        vatNumber?: string;
        address?: any;
    };
    items: InvoiceItem[];
};

@Injectable()
export class PdfService {
    constructor(private readonly facturXService: FacturXXmlService) { }

    async generateInvoice(invoice: FullInvoice, template: InvoiceTemplate, format: 'PDF' | 'FACTURX' = 'PDF'): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        // Fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Colors
        const primaryColor = hexToRgb(template?.primaryColor || '#000000');
        const textColor = rgb(0, 0, 0);
        const mutedColor = rgb(0.4, 0.4, 0.4);

        // Drawing Helpers
        const drawText = (text: string | null | undefined, x: number, y: number, size = 10, isBold = false, color = textColor) => {
            try {
                if (!text) return;
                page.drawText(String(text), {
                    x,
                    y,
                    size,
                    font: isBold ? fontBold : font,
                    color,
                });
            } catch (e) {
                // Ignore drawing errors
            }
        };

        const drawRightAligned = (text: string, x: number, y: number, size = 10, isBold = false, color = textColor) => {
            try {
                const textWidth = (isBold ? fontBold : font).widthOfTextAtSize(text, size);
                drawText(text, x - textWidth, y, size, isBold, color);
            } catch (e) { }
        };

        // LOGO HANDLING
        let logoImage = null;
        let logoDims = { width: 0, height: 0 };

        if (template?.logoUrl) {
            try {
                const imgBuffer = await this.fetchImage(template.logoUrl);
                if (imgBuffer) {
                    // Try embedding as PNG, fallback to JPG
                    try {
                        logoImage = await pdfDoc.embedPng(imgBuffer);
                    } catch (e) {
                        try {
                            logoImage = await pdfDoc.embedJpg(imgBuffer);
                        } catch (e2) {
                            console.warn('Failed to embed logo image (unknown format)', e2);
                        }
                    }
                }
            } catch (e) {
                console.warn('Failed to fetch logo image', e);
            }
        }

        if (logoImage) {
            const logoWidth = template.logoWidth || 100;
            logoDims = logoImage.scaleToFit(logoWidth, 100); // Max height 100 to avoid overlap
        }

        // --- LAYOUT LOGIC ---

        let y = height - 50;
        const margin = 50;
        let pageYLinesStart = height - 50; // Track where content starts for pagination

        // HEADER STYLE: BANNER vs CLASSIC
        const isBanner = template?.headerStyle === 'BANNER';

        // COMPANY INFO
        const logoX = template?.logoPosition === 'RIGHT' ? width - margin - (logoDims.width || 100) :
            template?.logoPosition === 'CENTER' ? (width - (logoDims.width || 0)) / 2 : margin;

        // Header Text Color
        const headerTextColor = isBanner ? rgb(1, 1, 1) : primaryColor;

        if (isBanner) {
            page.drawRectangle({
                x: 0,
                y: height - 150,
                width: width,
                height: 150,
                color: primaryColor
            });

            // If logo exists, draw it
            if (logoImage) {
                // On banner, logo might need to be carefully placed. 
                // If CENTER, verify y
                const logoY = height - 40 - logoDims.height; // slightly padded
                page.drawImage(logoImage, {
                    x: logoX,
                    y: logoY,
                    width: logoDims.width,
                    height: logoDims.height,
                });
            } else {
                drawText(invoice.company?.name || 'MON ENTREPRISE', margin, height - 50, 24, true, headerTextColor);
            }

            // Company Details (if Image used, maybe show Name smaller or hide? 
            // Usually if Logo is used, Name is hidden, but Address stays.
            // We'll show Name if Logo is missing OR if explicitly requested? 
            // Let's hide Name if Logo is present to avoid clutter, as per standard design.

            let bannerY = height - 80;
            const address = invoice.company?.address;
            const addrStr = typeof address === 'string' ? address : `${address?.street || ''}, ${address?.city || ''}`;
            drawText(addrStr, margin, bannerY, 10, false, headerTextColor);
            drawText(`${invoice.company?.email || ''} - ${invoice.company?.phone || ''}`, margin, bannerY - 15, 10, false, headerTextColor);

            // Invoice Badge
            drawRightAligned(`FACTURE N° ${invoice.invoiceNumber}`, width - margin, height - 50, 20, true, headerTextColor);
            drawRightAligned(`Date : ${new Date(invoice.issueDate).toLocaleDateString('fr-FR')}`, width - margin, height - 80, 10, false, headerTextColor);
            if (invoice.dueDate) {
                drawRightAligned(`Échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, width - margin, height - 95, 10, false, headerTextColor);
            }

            y = height - 170;
        } else {
            // CLASSIC / MODERN Layout

            if (logoImage) {
                page.drawImage(logoImage, {
                    x: logoX,
                    y: y - logoDims.height + 20, // Adjust Y to align top
                    width: logoDims.width,
                    height: logoDims.height,
                });
                // If logo is really tall, push Y down
                // But generally we just let it sit there.
            } else {
                drawText(invoice.company?.name, margin, y, 20, true, primaryColor);
            }

            y -= 25;

            const address = invoice.company?.address;
            const addrStr = typeof address === 'string' ? address : `${address?.street || ''}, ${address?.city || ''}`;
            drawText(addrStr, margin, y, 10, false, mutedColor);
            y -= 15;
            drawText(`${invoice.company?.email || ''} ${invoice.company?.phone ? '• ' + invoice.company.phone : ''}`, margin, y, 10, false, mutedColor);

            // Styled Date Box
            const boxWidth = 220;
            const boxHeight = 90;
            const boxX = width - margin - boxWidth;
            const boxY = height - 50 - boxHeight; // Top starts at height-50

            page.drawRectangle({
                x: boxX,
                y: boxY,
                width: boxWidth,
                height: boxHeight,
                color: rgb(0.98, 0.98, 0.99),
                borderColor: rgb(0.9, 0.9, 0.9),
                borderWidth: 1,
            });

            // Text inside box
            drawText("FACTURE", boxX + 15, boxY + boxHeight - 25, 18, true, primaryColor);

            const metaY = boxY + boxHeight - 50;
            drawText("N°", boxX + 15, metaY, 9, true, mutedColor);
            drawText(invoice.invoiceNumber, boxX + 80, metaY, 10, true, textColor);

            drawText("Date", boxX + 15, metaY - 15, 9, false, mutedColor);
            drawText(new Date(invoice.issueDate).toLocaleDateString('fr-FR'), boxX + 80, metaY - 15, 10, false, textColor);

            if (invoice.dueDate) {
                drawText("Échéance", boxX + 15, metaY - 30, 9, false, mutedColor);
                drawText(new Date(invoice.dueDate).toLocaleDateString('fr-FR'), boxX + 80, metaY - 30, 10, false, textColor);
            }

            y = height - 160;
        }

        // CLIENT INFO
        y -= 20;
        // Connector Line
        if (!isBanner) {
            page.drawLine({ start: { x: margin, y: y + 10 }, end: { x: margin + 30, y: y + 10 }, thickness: 2, color: primaryColor });
        }

        drawText("FACTURER À", margin, y, 9, true, mutedColor);
        y -= 25;
        drawText(invoice.client?.name || 'Client Inconnu', margin, y, 14, true, textColor);
        y -= 15;
        const clientAddr = invoice.client?.address;
        if (clientAddr) {
            const cAddrStr = typeof clientAddr === 'string' ? clientAddr : `${clientAddr.street || ''} ${clientAddr.zip || ''} ${clientAddr.city || ''}`;
            drawText(cAddrStr, margin, y, 10, false, mutedColor);
            y -= 15;
            drawText(invoice.client?.email || '', margin, y, 10, false, mutedColor);
        }


        // ITEMS TABLE
        y = height - 320;

        // Table Header Background
        page.drawRectangle({
            x: margin - 10,
            y: y - 8,
            width: width - (margin * 2) + 20,
            height: 28,
            color: primaryColor,
            opacity: 0.05
        });

        // Header Line
        page.drawLine({
            start: { x: margin - 10, y: y - 8 },
            end: { x: width - margin + 10, y: y - 8 },
            thickness: 1,
            color: primaryColor
        });

        const colQty = 340;
        const colPrice = 400;
        const colTotal = width - margin;

        drawText("DESCRIPTION", margin, y, 9, true, primaryColor);
        drawRightAligned("QTÉ", colQty, y, 9, true, primaryColor);
        drawRightAligned("PRIX U.", colPrice, y, 9, true, primaryColor);
        drawRightAligned("TOTAL HT", colTotal, y, 9, true, primaryColor);

        y -= 30;

        // Items Loop
        let subtotal = 0;
        if (invoice.items) {
            for (const item of invoice.items) {
                const total = (item.quantity || 0) * (item.unitPrice || 0);
                subtotal += total;

                drawText(item.description, margin, y, 10);
                drawRightAligned((item.quantity || 0).toString(), colQty, y, 10);
                drawRightAligned(item.unitPrice?.toFixed(2) + ' €', colPrice, y, 10);
                drawRightAligned(total.toFixed(2) + ' €', colTotal, y, 10, true);

                y -= 25;

                // Page Break Check
                if (y < 120) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                    // Optional: redraw header
                }
            }
        }

        // TOTALS SECTION
        y -= 20;
        // Separator
        page.drawLine({ start: { x: colQty, y: y + 15 }, end: { x: width - margin, y: y + 15 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

        const vatAmount = subtotal * 0.20;
        const totalTTC = subtotal + vatAmount;

        drawRightAligned("Total HT", colPrice, y, 10, false, mutedColor);
        drawRightAligned(subtotal.toFixed(2) + ' €', colTotal, y, 11, true, textColor);
        y -= 20;

        drawRightAligned("TVA (20%)", colPrice, y, 10, false, mutedColor);
        drawRightAligned(vatAmount.toFixed(2) + ' €', colTotal, y, 11, true, textColor);
        y -= 30;

        // Net Payable Box
        const netBoxWidth = 200;
        const netBoxHeight = 35;
        page.drawRectangle({
            x: width - margin - netBoxWidth,
            y: y - 10,
            width: netBoxWidth,
            height: netBoxHeight,
            color: primaryColor
        });

        drawText("NET À PAYER", width - margin - netBoxWidth + 15, y + 2, 10, true, rgb(1, 1, 1));
        drawRightAligned(totalTTC.toFixed(2) + ' €', width - margin - 15, y + 2, 14, true, rgb(1, 1, 1));

        // FOOTER & LEGAL
        // Standard Footer Text
        const footerText = template?.legalMentions || invoice.company?.legalMentions || "";
        // Mandatory Late Fee
        const mandatoryLegal = "En cas de retard de paiement, indemnité forfaitaire de 40€ pour frais de recouvrement (Art. D. 441-5 C. Com.) + pénalités.";
        // Company Legal Line
        const companyLegal = [
            invoice.company?.name,
            invoice.company?.siret ? `SIREN ${invoice.company.siret}` : '',
            invoice.company?.rcs ? `RCS ${invoice.company.rcs}` : '',
            invoice.company?.vatNumber ? `TVA ${invoice.company.vatNumber}` : '',
            invoice.company?.capital ? `Capital ${invoice.company.capital} €` : ''
        ].filter(Boolean).join(' • ');

        drawText(footerText, margin, 70, 9, false, mutedColor);
        drawText(mandatoryLegal, margin, 55, 7, false, rgb(0.5, 0.5, 0.5));

        // Centered Company Info at very bottom
        const legalWidth = font.widthOfTextAtSize(companyLegal, 8);
        drawText(companyLegal, (width - legalWidth) / 2, 35, 8, false, mutedColor);

        if (invoice.company?.iban) {
            const ibanTxt = `IBAN: ${invoice.company.iban} ${invoice.company.bic ? '- BIC: ' + invoice.company.bic : ''}`;
            const ibanWidth = font.widthOfTextAtSize(ibanTxt, 8);
            drawText(ibanTxt, (width - ibanWidth) / 2, 25, 8, false, mutedColor);
        }

        // --- FACTUR-X ATTACHMENT ---
        if (format === 'FACTURX') {
            const xml = this.facturXService.generateXml(invoice);
            const xmlBytes = Buffer.from(xml, 'utf8');

            await pdfDoc.attach(xmlBytes, 'factur-x.xml', {
                mimeType: 'text/xml',
                description: 'Factur-X Invoice Data',
                creationDate: new Date(),
                modificationDate: new Date(),
            });

            pdfDoc.setTitle(`Facture ${invoice.invoiceNumber}`);
            pdfDoc.setAuthor(invoice.company?.name || '');
            pdfDoc.setSubject('Factur-X Invoice');
            pdfDoc.setProducer('Factuer FR');
        }

        return pdfDoc.save();
    }

    private async fetchImage(url: string): Promise<Uint8Array | null> {
        try {
            if (!url || !url.startsWith('http')) return null;
            const response = await fetch(url);
            if (!response.ok) return null;
            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        } catch (error) {
            console.error('Failed to fetch logo image:', url, error);
            return null;
        }
    }
}
