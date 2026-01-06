import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller('admin/plans')
@UseGuards(JwtAdminAuthGuard)
export class AdminSubscriptionsController {
    constructor(private readonly service: AdminSubscriptionsService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
