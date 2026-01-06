import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        // Initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const { access_token, user } = await this.authService.validateOAuthUser(req.user);

        // Redirect based on role
        if (['FIRM_ADMIN', 'FIRM_USER'].includes(user.role)) {
            // Accountant App (Port 3002)
            res.redirect(`http://localhost:3002/auth/callback?token=${access_token}`);
        } else {
            // Client App (Port 3000)
            res.redirect(`http://localhost:3000/auth/callback?token=${access_token}`);
        }
    }
}
