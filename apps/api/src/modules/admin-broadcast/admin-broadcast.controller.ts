import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminBroadcastService } from './admin-broadcast.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/broadcasts')
@UseGuards(JwtAdminAuthGuard)
export class AdminBroadcastController {
    constructor(private readonly service: AdminBroadcastService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    @Patch(':id/status')
    toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
        return this.service.toggleActive(id, isActive);
    }
}
