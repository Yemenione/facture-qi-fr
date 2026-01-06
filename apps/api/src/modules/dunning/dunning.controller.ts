import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { DunningService } from './dunning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyScopeGuard } from '../auth/guards/company-scope.guard';

@Controller('dunning')
@UseGuards(JwtAuthGuard, CompanyScopeGuard)
export class DunningController {
    constructor(private readonly dunningService: DunningService) { }

    @Get('overdue')
    async getOverdue(@Request() req) {
        return this.dunningService.getOverdueInvoices(req.user.companyId);
    }

    @Post(':id/remind')
    async remind(@Request() req, @Param('id') id: string) {
        return this.dunningService.remind(req.user.companyId, id);
    }
}
