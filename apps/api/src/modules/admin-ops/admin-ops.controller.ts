import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { AdminOpsService } from './admin-ops.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';
import { Response } from 'express';

@Controller('admin/ops')
@UseGuards(JwtAdminAuthGuard)
export class AdminOpsController {
    constructor(private readonly opsService: AdminOpsService) { }

    @Get('backup')
    async downloadBackup(@Res() res: Response) {
        const backupData = await this.opsService.getSystemBackup();
        const filename = `backup-${new Date().toISOString().split('T')[0]}.json`;

        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.json(backupData);
    }
}
