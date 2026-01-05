import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { CompanySettingsService } from './company-settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('company-settings')
@UseGuards(JwtAuthGuard)
export class CompanySettingsController {
    constructor(private readonly settingsService: CompanySettingsService) { }

    @Get()
    async get(@Request() req) {
        return this.settingsService.get(req.user.companyId);
    }

    @Put()
    async update(@Body() updateDto: any, @Request() req) {
        return this.settingsService.update(updateDto, req.user.companyId);
    }
}
