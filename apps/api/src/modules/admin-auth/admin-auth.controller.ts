import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post('login')
    login(@Body() loginDto: AdminLoginDto) {
        return this.adminAuthService.login(loginDto);
    }

    @Post('seed')
    seed() {
        return this.adminAuthService.seedDefaultAdmin();
    }
}
