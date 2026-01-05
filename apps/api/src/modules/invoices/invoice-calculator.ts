export class InvoiceCalculator {
    static round(amount: number): number {
        return Math.round(amount * 100) / 100;
    }

    static calculateLine(quantity: number, unitPrice: number, vatRate: number) {
        const totalHT = this.round(quantity * unitPrice);
        const vatAmount = this.round(totalHT * (vatRate / 100));
        const totalTTC = this.round(totalHT + vatAmount);

        return { totalHT, vatAmount, totalTTC };
    }

    static calculateInvoice(items: { quantity: number; unitPrice: number; vatRate: number }[]) {
        let totalHT = 0;
        let totalTTC = 0;
        let vatDetails: Record<number, number> = {};

        for (const item of items) {
            const line = this.calculateLine(item.quantity, item.unitPrice, item.vatRate);

            totalHT += line.totalHT;
            totalTTC += line.totalTTC;

            // VAT Breakdown
            if (!vatDetails[item.vatRate]) {
                vatDetails[item.vatRate] = 0;
            }
            vatDetails[item.vatRate] += line.vatAmount;
        }

        // Final rounding for grand totals to avoid floating point errors
        totalHT = this.round(totalHT);
        totalTTC = this.round(totalTTC);
        const totalVAT = this.round(totalTTC - totalHT);

        return {
            totalHT,
            totalVAT,
            totalTTC,
            vatDetails // For PDF/Factur-X breakdown
        };
    }
}
