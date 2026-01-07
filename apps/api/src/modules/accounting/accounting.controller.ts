import { Controller, Get, Query, UseGuards, Res, Request } from '@nestjs/common';
import { Response } from 'express';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) { }

    @Get('fec')
    async downloadFEC(@Request() req, @Query('year') year: string, @Res() res: Response) {
        const companyId = req.user.companyId;
        const yearInt = year ? parseInt(year) : new Date().getFullYear();

        const fileContent = await this.accountingService.generateFEC(companyId, yearInt);

        const filename = `${req.user.siret || 'company'}FEC${yearInt}1231.txt`;

        res.set({
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.send(fileContent);
    }
}
