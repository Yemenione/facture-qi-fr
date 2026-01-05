import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendInvoice(to: string, invoiceNumber: string, pdfBuffer: Buffer) {
        await this.transporter.sendMail({
            from: '"Facture App" <no-reply@facture-app.com>', // TODO: Configure from env
            to,
            subject: `Votre facture N° ${invoiceNumber}`,
            text: `Bonjour,\n\nVeuillez trouver ci-joint votre facture N° ${invoiceNumber}.\n\nCordialement,`,
            attachments: [
                {
                    filename: `Facture-${invoiceNumber}.pdf`,
                    content: pdfBuffer,
                },
            ],
        });
    }
}
