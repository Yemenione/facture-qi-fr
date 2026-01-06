import { Controller, Get, Post, Param, UseGuards, Body, Delete } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/companies')
@UseGuards(JwtAdminAuthGuard)
export class AdminCompaniesController {
    constructor(private readonly adminCompaniesService: AdminCompaniesService) { }

    @Get()
    findAll() {
        return this.adminCompaniesService.findAll();
    }

    @Post(':id/impersonate')
    impersonate(@Param('id') id: string) {
        return this.adminCompaniesService.impersonate(id);
    }

    @Post(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.adminCompaniesService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.adminCompaniesService.delete(id);
    }
}
