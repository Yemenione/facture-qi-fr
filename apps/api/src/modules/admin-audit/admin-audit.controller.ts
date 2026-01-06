import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAuditService } from './admin-audit.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/audit')
@UseGuards(JwtAdminAuthGuard)
export class AdminAuditController {
    constructor(private readonly service: AdminAuditService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
