import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';

const DEBUG_LOG_FILE = path.join(process.cwd(), 'api-debug.log');

function logDebug(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    try {
        fs.appendFileSync(DEBUG_LOG_FILE, logMessage);
    } catch (err) {
        console.error("Failed to write to debug log", err);
    }
}

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    async create(@Request() req, @Body() createClientDto: CreateClientDto) {
        logDebug("Received Create Client Request", { userId: req.user.id, dto: createClientDto });
        try {
            const result = await this.clientsService.create(req.user.id, createClientDto);
            logDebug("Client Created Successfully", { id: result.id });
            return result;
        } catch (error) {
            logDebug("Error Creating Client", { message: error.message, stack: error.stack });
            throw error;
        }
    }

    @Get()
    async findAll(@Request() req) {
        logDebug("Received FindAll Clients Request", { userId: req.user.id });
        const results = await this.clientsService.findAll(req.user.id);
        logDebug("FindAll Clients Result", { count: results.length });
        return results;
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.clientsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, req.user.id, updateClientDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.clientsService.remove(id, req.user.id);
    }
}
