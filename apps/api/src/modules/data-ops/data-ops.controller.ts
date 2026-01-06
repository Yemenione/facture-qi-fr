import { Controller, Get, Post, Param, Query, Res, UseGuards, Request, Body } from '@nestjs/common';
import { DataOpsService } from './data-ops.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('data-ops')
@UseGuards(JwtAuthGuard)
export class DataOpsController {
    constructor(private readonly dataService: DataOpsService) { }

    @Get('export/:type')
    async export(
        @Param('type') type: string,
        @Query('format') format: 'xlsx' | 'csv',
        @Query('id') id: string,
        @Res() res: Response,
        @Request() req
    ) {
        return this.dataService.exportData(type, format || 'xlsx', res, req.user.companyId, id);
    }

    @Post('import/:type')
    async import(
        @Param('type') type: string,
        @Body() body: { data: any[] },
        @Request() req
    ) {
        return this.dataService.importData(type, body.data, req.user.companyId);
    }
}
