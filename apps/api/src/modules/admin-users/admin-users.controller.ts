import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/users')
@UseGuards(JwtAdminAuthGuard)
export class AdminUsersController {
    constructor(private readonly adminUsersService: AdminUsersService) { }

    @Get()
    findAll() {
        return this.adminUsersService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.adminUsersService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.adminUsersService.delete(id);
    }
}
