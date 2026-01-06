import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminVerificationService } from './admin-verification.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/verification')
@UseGuards(JwtAdminAuthGuard)
export class AdminVerificationController {
    constructor(private readonly service: AdminVerificationService) { }

    @Get('pending')
    findAllPending() {
        return this.service.findAllPending();
    }

    @Post(':id/approve')
    approve(@Param('id') id: string) {
        return this.service.approve(id);
    }

    @Post(':id/reject')
    reject(@Param('id') id: string) {
        return this.service.reject(id);
    }
}
