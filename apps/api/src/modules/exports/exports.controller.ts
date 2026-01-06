
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FecService } from './fec.service';

@Controller('exports')
@UseGuards(JwtAuthGuard)
export class ExportsController {
    constructor(private readonly fecService: FecService) { }

    @Get('fec')
    async downloadFec(@Req() req, @Query('year') year: string, @Res() res: Response) {
        const companyId = req.user.companyId;
        const yearInt = parseInt(year) || new Date().getFullYear();

        const fecContent = await this.fecService.generateFec(companyId, yearInt);
        const siren = '000000000'; // Should fetch company SIREN, using placeholder or user.company.siret
        const filename = `${siren}FEC${yearInt}1231.txt`; // Standard naming convention

        res.set({
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.send(fecContent);
    }
}
