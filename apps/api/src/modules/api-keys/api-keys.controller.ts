import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) { }

    @Post()
    create(@Request() req, @Body('name') name: string) {
        return this.apiKeysService.create(req.user.companyId, name || 'New Key');
    }

    @Get()
    findAll(@Request() req) {
        return this.apiKeysService.findAll(req.user.companyId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.apiKeysService.delete(req.user.companyId, id);
    }
}
