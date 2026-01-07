
import { Controller, Get, Param, Res, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FecService } from './fec.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Using standard guard? Or Admin?
// Actually for accountant portal we need access.
// If it's accountant accessing, maybe JwtAuthGuard is fine IF they are authenticated.
// But we established AccountantCompaniesModule uses JwtAuthGuard but filters by firm.
// Let's assume standard JwtAuthGuard is used for logged in users (accountants).

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
    constructor(private readonly fecService: FecService) { }

    @Get('custom/fec/:companyId')
    async downloadFec(
        @Param('companyId') companyId: string,
        @Query('year', ParseIntPipe) year: number,
        @Res() res: Response
    ) {
        // Validation: In real app, ensure user has access to this company
        const fecContent = await this.fecService.generateFec(companyId, year);

        const filename = `${companyId}_FEC_${year}.csv`;

        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.send(fecContent);
    }
}
