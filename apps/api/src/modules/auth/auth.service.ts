import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs'; // Using bcryptjs for simplicity in this setup

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // 1. Check if user exists
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) throw new ConflictException('Email déjà utilisé');

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 3. Create Company & Admin User Transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Find default plan (or create a dummy one if empty DB)
            let plan = await tx.subscriptionPlan.findFirst({ where: { code: 'FREE' } });
            if (!plan) {
                plan = await tx.subscriptionPlan.create({
                    data: { code: 'FREE', name: 'Freemium', priceMonthly: 0, maxInvoices: 10, maxUsers: 1, features: {} }
                });
            }

            const company = await tx.company.create({
                data: {
                    name: dto.companyName,
                    siren: '000000000', // To be filled later
                    planId: plan.id,
                    subscriptionStatus: 'ACTIVE',
                    address: {},
                }
            });

            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    role: 'ADMIN',
                    companyId: company.id,
                }
            });

            return { company, user };
        });

        return this.login({ email: dto.email, password: dto.password });
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Identifiants invalides');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Identifiants invalides');

        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            role: user.role
        };

        return this.generateJwt(user);
    }

    async validateOAuthUser(profile: any) {
        let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

        if (!user) {
            // Auto-register logic for Google Users
            const result = await this.prisma.$transaction(async (tx) => {
                let plan = await tx.subscriptionPlan.findFirst({ where: { code: 'FREE' } });
                if (!plan) {
                    plan = await tx.subscriptionPlan.create({
                        data: { code: 'FREE', name: 'Freemium', priceMonthly: 0, maxInvoices: 10, maxUsers: 1, features: {} }
                    });
                }

                const company = await tx.company.create({
                    data: {
                        name: `${profile.firstName} ${profile.lastName} Company`,
                        siren: Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'), // Random temporary SIREN
                        planId: plan.id,
                        subscriptionStatus: 'ACTIVE',
                        address: {},
                    }
                });

                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                return tx.user.create({
                    data: {
                        email: profile.email,
                        password: hashedPassword,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        role: 'ADMIN',
                        companyId: company.id,
                        // googleId: profile.googleId // If you add googleId to schema later
                    }
                });
            });
            user = result;
        }

        return this.generateJwt(user);
    }

    private generateJwt(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        };
    }
}
