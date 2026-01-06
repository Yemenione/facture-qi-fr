import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Get()
    async findAll(@Request() req) {
        return this.templatesService.findAll(req.user.companyId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.templatesService.findOne(id, req.user.companyId);
    }

    @Post()
    async create(@Body() createDto: CreateTemplateDto, @Request() req) {
        return this.templatesService.create(createDto, req.user.companyId);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDto: CreateTemplateDto, @Request() req) {
        return this.templatesService.update(id, updateDto, req.user.companyId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        return this.templatesService.remove(id, req.user.companyId);
    }

    @Put(':id/set-default')
    async setDefault(@Param('id') id: string, @Request() req) {
        return this.templatesService.setDefault(id, req.user.companyId);
    }
}
