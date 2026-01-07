import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class BankingService {
    constructor(private prisma: PrismaService) { }

    async createAccount(companyId: string, name: string, bankName: string, iban: string, currency: string = 'EUR') {
        return this.prisma.bankAccount.create({
            data: {
                companyId,
                name,
                bankName,
                iban,
                currency
            }
        });
    }

    async getAccounts(companyId: string) {
        return this.prisma.bankAccount.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });
    }

    async getTransactions(companyId: string, accountId: string) {
        // Verify ownership
        const account = await this.prisma.bankAccount.findFirst({
            where: { id: accountId, companyId }
        });
        if (!account) throw new Error('Account not found');

        return this.prisma.bankTransaction.findMany({
            where: { bankAccountId: accountId },
            orderBy: { date: 'desc' }
        });
    }

    async importStatement(companyId: string, accountId: string, filePath: string) {
        // Verify ownership
        const account = await this.prisma.bankAccount.findFirst({
            where: { id: accountId, companyId }
        });
        if (!account) throw new Error('Account not found');

        const workbook = new ExcelJS.Workbook();
        await workbook.csv.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        const transactions: any[] = [];

        let importedCount = 0;

        // Assumes simple CSV: Date, Label, Amount, Reference (Optional)
        // or Header row: Date, Label, Amount
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            // Parse Date
            const dateCell = row.getCell(1).value;
            let date = new Date();
            if (dateCell instanceof Date) date = dateCell;
            else if (typeof dateCell === 'string') date = new Date(dateCell);

            // Parse Label
            const label = row.getCell(2).text;

            // Parse Amount
            const amountCell = row.getCell(3).value;
            let amount = 0;
            if (typeof amountCell === 'number') amount = amountCell;
            else if (typeof amountCell === 'string') amount = parseFloat(amountCell.replace(',', '.'));

            // Basic validation
            if (label && !isNaN(amount)) {
                transactions.push({
                    bankAccountId: accountId,
                    date: date,
                    label: label,
                    amount: amount,
                    reference: row.getCell(4).text || null,
                    status: 'PENDING'
                });
            }
        });

        // Batch create
        if (transactions.length > 0) {
            await this.prisma.bankTransaction.createMany({
                data: transactions
            });
            importedCount = transactions.length;
        }

        return { imported: importedCount };
    }

    async deleteAccount(companyId: string, id: string) {
        return this.prisma.bankAccount.deleteMany({
            where: { id, companyId }
        });
    }
}
