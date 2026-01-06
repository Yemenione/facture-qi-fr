import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyScopeGuard } from '../auth/guards/company-scope.guard';
import { AccountingService } from './accounting.service';

@Controller('accounting')
@UseGuards(JwtAuthGuard, CompanyScopeGuard)
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) { }

    @Get('stats')
    async getStats(@Request() req, @Query('year') year?: string) {
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        return this.accountingService.getStats(req.user.companyId, targetYear);
    }

    @Get('journal')
    async getJournal(@Request() req, @Query('limit') limit?: string) {
        return this.accountingService.getJournal(req.user.companyId, limit ? parseInt(limit) : 50);
    }
}
