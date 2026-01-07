import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { AccountantCompaniesService } from './accountant-companies.service';
import { AccountantStatsService } from './accountant-stats.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('accountant/companies')
@UseGuards(AuthGuard('jwt'))
export class AccountantCompaniesController {
    constructor(
        private readonly accountantCompaniesService: AccountantCompaniesService,
        private readonly accountantStatsService: AccountantStatsService,
        private readonly jwtService: JwtService
    ) { }

    @Get('dashboard/stats')
    getStats(@Request() req) {
        return this.accountantStatsService.getCockpitStats(req.user.accountantFirmId);
    }

    @Get()
    findAll(@Request() req) {
        return this.accountantCompaniesService.findAll(req.user.id);
    }

    @Post(':id/impersonate')
    impersonate(@Request() req, @Param('id') id: string) {
        console.log(`[Controller] Impersonate request: userId=${req.user?.id}, companyId=${id}`);
        return this.accountantCompaniesService.impersonate(req.user.id, id, this.jwtService);
    }

    @Get(':id/unreconciled-transactions')
    getUnreconciled(@Param('id') id: string) {
        return this.accountantCompaniesService.getUnreconciledTransactions(id);
    }

    @Get(':id/pending-expenses')
    getPendingExpenses(@Param('id') id: string) {
        return this.accountantCompaniesService.getPendingExpenses(id);
    }

    @Get(':id/expenses')
    getCompanyExpenses(@Param('id') id: string) {
        return this.accountantCompaniesService.getPendingExpenses(id);
    }

    @Get(':id')
    async getCompanyDetails(@Param('id') id: string) {
        return this.accountantCompaniesService.getCompanyDetails(id);
    }
}
