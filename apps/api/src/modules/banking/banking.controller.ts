import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BankingService } from './banking.service';
import { ReconciliationService } from './reconciliation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('banking')
@UseGuards(JwtAuthGuard)
export class BankingController {
    constructor(
        private readonly bankingService: BankingService,
        private readonly reconciliationService: ReconciliationService
    ) { }

    @Post('accounts')
    createAccount(@Request() req, @Body() body: any) {
        return this.bankingService.createAccount(
            req.user.companyId,
            body.name,
            body.bankName,
            body.iban,
            body.currency
        );
    }

    @Get('accounts')
    getAccounts(@Request() req) {
        return this.bankingService.getAccounts(req.user.companyId);
    }

    @Delete('accounts/:id')
    deleteAccount(@Request() req, @Param('id') id: string) {
        return this.bankingService.deleteAccount(req.user.companyId, id);
    }

    @Get('accounts/:id/transactions')
    getTransactions(@Request() req, @Param('id') id: string) {
        return this.bankingService.getTransactions(req.user.companyId, id);
    }

    @Post('accounts/:id/import')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async importStatement(@Request() req, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new Error('File required');

        try {
            const result = await this.bankingService.importStatement(req.user.companyId, id, file.path);

            // Clean up temp file
            const fs = require('fs');
            fs.unlinkSync(file.path);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Import failed');
        }
    }

    @Get('reconciliation/suggest')
    async suggestMatches(@Request() req) {
        return this.reconciliationService.suggestMatches(req.user.companyId);
    }

    @Post('reconciliation/reconcile')
    async reconcile(@Body() body: { transactionId: string; expenseId: string }) {
        return this.reconciliationService.reconcile(body.transactionId, body.expenseId);
    }
}
