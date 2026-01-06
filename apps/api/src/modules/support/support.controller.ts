import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtAdminAuthGuard } from '../admin-auth/jwt-admin-auth.guard';

@Controller()
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    // --- Client Routes ---
    @UseGuards(JwtAuthGuard)
    @Post('tickets')
    createTicket(@Request() req, @Body() body: any) {
        return this.supportService.createTicket(req.user.userId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('tickets')
    getMyTickets(@Request() req) {
        return this.supportService.getMyTickets(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('tickets/:id/reply')
    replyTicket(@Request() req, @Param('id') id: string, @Body() body: any) {
        return this.supportService.replyToTicket(id, req.user.userId, body.content);
    }

    // --- Admin Routes ---
    @UseGuards(JwtAdminAuthGuard)
    @Get('admin/tickets')
    getAllTickets() {
        return this.supportService.getAllTickets();
    }

    @UseGuards(JwtAdminAuthGuard)
    @Post('admin/tickets/:id/reply')
    adminReply(@Param('id') id: string, @Body() body: any) {
        return this.supportService.adminReply(id, body.content, body.status);
    }
}
