import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type ReconciliationMatch = {
    transactionId: string;
    expenseId: string;
    confidence: number;
    reason: string;
};

@Injectable()
export class ReconciliationService {
    constructor(private prisma: PrismaService) { }

    async suggestMatches(companyId: string): Promise<ReconciliationMatch[]> {
        // Get unreconciled transactions
        const transactions = await this.prisma.bankTransaction.findMany({
            where: {
                bankAccount: { companyId },
                status: 'PENDING'
            }
        });

        // Get pending expenses
        const expenses = await this.prisma.expense.findMany({
            where: {
                companyId,
                status: 'PENDING'
            }
        });

        const matches: ReconciliationMatch[] = [];

        // Match algorithm
        for (const tx of transactions) {
            for (const exp of expenses) {
                const confidence = this.calculateConfidence(tx, exp);

                if (confidence > 0.7) { // 70% threshold
                    matches.push({
                        transactionId: tx.id,
                        expenseId: exp.id,
                        confidence,
                        reason: this.getMatchReason(tx, exp, confidence)
                    });
                }
            }
        }

        // Sort by confidence
        return matches.sort((a, b) => b.confidence - a.confidence);
    }

    private calculateConfidence(transaction: any, expense: any): number {
        let score = 0;
        let factors = 0;

        // Amount match (most important)
        const amountDiff = Math.abs(Math.abs(transaction.amount) - expense.amount);
        if (amountDiff === 0) {
            score += 0.5; // Exact match
        } else if (amountDiff < 1) {
            score += 0.4; // Very close
        } else if (amountDiff < 5) {
            score += 0.2; // Close
        }
        factors++;

        // Date match (±3 days)
        const txDate = new Date(transaction.date);
        const expDate = new Date(expense.date);
        const daysDiff = Math.abs((txDate.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            score += 0.3; // Same day
        } else if (daysDiff <= 3) {
            score += 0.2; // Within 3 days
        } else if (daysDiff <= 7) {
            score += 0.1; // Within a week
        }
        factors++;

        // Description match
        if (transaction.description && expense.supplier) {
            const txDesc = transaction.description.toLowerCase();
            const expSupplier = expense.supplier.toLowerCase();

            if (txDesc.includes(expSupplier) || expSupplier.includes(txDesc)) {
                score += 0.2;
            }
        }
        factors++;

        return score / factors;
    }

    private getMatchReason(transaction: any, expense: any, confidence: number): string {
        const reasons: string[] = [];

        const amountDiff = Math.abs(Math.abs(transaction.amount) - expense.amount);
        if (amountDiff === 0) {
            reasons.push('Montant exact');
        }

        const txDate = new Date(transaction.date);
        const expDate = new Date(expense.date);
        const daysDiff = Math.abs((txDate.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            reasons.push('Même date');
        } else if (daysDiff <= 3) {
            reasons.push(`±${Math.round(daysDiff)} jours`);
        }

        if (transaction.description && expense.supplier) {
            const txDesc = transaction.description.toLowerCase();
            const expSupplier = expense.supplier.toLowerCase();

            if (txDesc.includes(expSupplier) || expSupplier.includes(txDesc)) {
                reasons.push('Description similaire');
            }
        }

        return reasons.join(', ') || 'Correspondance automatique';
    }

    async reconcile(transactionId: string, expenseId: string): Promise<void> {
        await this.prisma.$transaction([
            this.prisma.bankTransaction.update({
                where: { id: transactionId },
                data: {
                    status: 'RECONCILED',
                    expenseId
                }
            }),
            this.prisma.expense.update({
                where: { id: expenseId },
                data: { status: 'APPROVED' }
            })
        ]);
    }
}
