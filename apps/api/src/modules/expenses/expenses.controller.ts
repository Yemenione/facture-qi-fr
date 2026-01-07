import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto'; // Added this import
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/receipts',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    create(@Request() req, @Body() createExpenseDto: any, @UploadedFile() file: Express.Multer.File) {
        // Parse the body if it came as form-data (which are strings)
        const dto = {
            ...createExpenseDto,
            amount: parseFloat(createExpenseDto.amount),
            vatAmount: createExpenseDto.vatAmount ? parseFloat(createExpenseDto.vatAmount) : undefined,
            proofUrl: file ? `/uploads/receipts/${file.filename}` : undefined
        };
        return this.expensesService.create(req.user.companyId, dto);
    }

    @Post('scan')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/receipts',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async scan(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('File is required');
        }

        // Read the file buffer for OCR
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(file.path);

        const scanResult = await this.expensesService.scanReceipt(fileBuffer);

        return {
            ...scanResult,
            url: `/uploads/receipts/${file.filename}`
        };
    }

    @Get()
    findAll(@Request() req) {
        return this.expensesService.findAll(req.user.companyId);
    }

    @Get('stats')
    findStats(@Request() req) {
        return this.expensesService.findStats(req.user.companyId);
    }

    @Delete(':id')
    delete(@Request() req, @Param('id') id: string) {
        return this.expensesService.delete(req.user.companyId, id);
    }

    @Patch(':id/status')
    updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: any) {
        return this.expensesService.updateStatus(req.user.companyId, id, status);
    }

    @Patch(':id/validate')
    async validate(
        @Param('id') id: string,
        @Body() body: { status: 'APPROVED' | 'REJECTED'; note?: string }
    ) {
        return this.expensesService.validateExpense(id, body.status, body.note);
    }
}
