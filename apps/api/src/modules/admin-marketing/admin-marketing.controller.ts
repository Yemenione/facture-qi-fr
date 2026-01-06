import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminMarketingService } from './admin-marketing.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/marketing')
@UseGuards(JwtAdminAuthGuard)
export class AdminMarketingController {
    constructor(private readonly marketingService: AdminMarketingService) { }

    @Get('campaigns')
    getCampaigns() {
        return this.marketingService.findAll();
    }

    @Post('campaigns')
    createCampaign(@Body() body: { subject: string; content: string; segment: string }) {
        return this.marketingService.create(body);
    }
}
