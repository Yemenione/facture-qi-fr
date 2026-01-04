import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.usersService.findAllByCompany(req.user.companyId);
    }
}
