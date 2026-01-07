import { Module } from '@nestjs/common';
import { AccountantCompaniesService } from './accountant-companies.service';
import { AccountantCompaniesController } from './accountant-companies.controller';
import { AccountantStatsService } from './accountant-stats.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AccountantCompaniesController],
    providers: [AccountantCompaniesService, AccountantStatsService],
    exports: [AccountantCompaniesService],
})
export class AccountantCompaniesModule { }
