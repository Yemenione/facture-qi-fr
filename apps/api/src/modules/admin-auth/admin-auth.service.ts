import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: AdminLoginDto) {
        const admin = await this.prisma.superAdmin.findUnique({
            where: { email: loginDto.email },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: admin.id, email: admin.email, role: 'SUPER_ADMIN' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    // Temporary helper to seed an admin if none exists
    async seedDefaultAdmin() {
        const count = await this.prisma.superAdmin.count();
        if (count === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.prisma.superAdmin.create({
                data: {
                    email: 'admin@facture-fr.com',
                    password: hashedPassword,
                    name: 'Super Admin',
                },
            });
            console.log('Seeded default admin: admin@facture-fr.com / admin123');
        }
    }
}
