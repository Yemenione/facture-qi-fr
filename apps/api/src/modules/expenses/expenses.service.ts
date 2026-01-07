import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

import { OcrService } from '../automation/ocr.service';

@Injectable()
export class ExpensesService {
    constructor(
        private prisma: PrismaService,
        private ocrService: OcrService
    ) { }

    async create(companyId: string, dto: CreateExpenseDto) {
        return this.prisma.expense.create({
            data: {
                ...dto,
                companyId,
                status: 'PENDING'
            }
        });
    }

    async findAll(companyId: string) {
        return this.prisma.expense.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    }

    async findStats(companyId: string) {
        const expenses = await this.prisma.expense.findMany({
            where: { companyId }
        });

        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const count = expenses.length;
        // Group by category
        const byCategory = expenses.reduce((acc, curr) => {
            const cat = curr.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + curr.amount;
            return acc;
        }, {});

        return { total, count, byCategory };
    }

    async delete(companyId: string, id: string) {
        return this.prisma.expense.deleteMany({
            where: { id, companyId }
        });
    }

    async updateStatus(companyId: string, id: string, status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED') {
        return this.prisma.expense.updateMany({
            where: { id, companyId },
            data: { status }
        });
    }

    async scanReceipt(fileBuffer: Buffer) {
        const ocrResult = await this.ocrService.processImage(fileBuffer);
        return {
            detected: {
                amount: ocrResult.total,
                date: ocrResult.date,
                supplier: ocrResult.merchant,
                rawText: ocrResult.rawText
            }
        };
    }

    async validateExpense(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
        const expense = await this.prisma.expense.update({
            where: { id },
            data: {
                status
            },
            include: {
                company: { select: { name: true } }
            }
        });

        return expense;
    }
}
