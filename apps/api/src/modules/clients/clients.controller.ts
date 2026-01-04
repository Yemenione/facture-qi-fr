import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    create(@Request() req, @Body() createClientDto: CreateClientDto) {
        // req.user is populated by JwtAuthGuard
        return this.clientsService.create(req.user.companyId, createClientDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.clientsService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.clientsService.findOne(req.user.companyId, id);
    }
}
