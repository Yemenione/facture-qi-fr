import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

// Interface for extracted data
export interface OCRResult {
    rawText: string;
    total?: number;
    date?: Date;
    merchant?: string;
}

@Injectable()
export class OcrService {

    async processImage(buffer: Buffer): Promise<OCRResult> {
        try {
            // Tesseract.js accepts buffer directly in many versions, but typically expects an image path or specific buffer format
            // For stability in Node, recognize buffer
            const result = await Tesseract.recognize(buffer, 'eng+fra', {
                logger: m => console.log(m) // Optional logging
            });

            const text = result.data.text;
            return this.extractData(text);
        } catch (error) {
            console.error("OCR Failed:", error);
            return { rawText: "" };
        }
    }

    private extractData(text: string): OCRResult {
        const lines = text.split('\n');
        let total: number | undefined;
        let date: Date | undefined;
        let merchant: string | undefined;

        // --- Basic Heuristics (Regex) ---

        // 1. Total Amount (Look for "Total", "Net", "Montant" followed by numbers)
        // Matches: 12.50, 12,50, 12.50€, 12,50 EUR
        const amountRegex = /(?:total|net|montant|payer|ttc)[\s\S]{0,20}?(\d+[.,]\d{2})/i;
        const amountMatch = text.match(amountRegex);
        if (amountMatch) {
            total = parseFloat(amountMatch[1].replace(',', '.'));
        }

        // 2. Date (DD/MM/YYYY or YYYY-MM-DD or DD-MM-YYYY)
        const dateRegex = /(\d{2}[-./]\d{2}[-./]\d{4})|(\d{4}[-./]\d{2}[-./]\d{2})/;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
            // normalizing separators
            const dateStr = dateMatch[0].replace(/[-.]/g, '/');
            // Try parse (assuming DD/MM/YYYY for FR)
            const parts = dateStr.split('/');
            if (parts[0].length === 4) {
                date = new Date(dateStr); // YYYY/MM/DD
            } else {
                // DD/MM/YYYY
                date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }

        // 3. Merchant (First non-empty line usually)
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 2 && !merchant) {
                // Ignore likely garbage or common receipts header words if necessary
                if (!trimmed.toLowerCase().includes('ticket') && !trimmed.toLowerCase().includes('carte')) {
                    merchant = trimmed;
                }
            }
        }

        return {
            rawText: text,
            total,
            date,
            merchant
        };
    }
}
