import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
