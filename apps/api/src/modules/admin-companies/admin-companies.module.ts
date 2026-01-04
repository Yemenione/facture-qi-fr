import { Module } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { AdminCompaniesController } from './admin-companies.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [AdminCompaniesController],
    providers: [AdminCompaniesService, PrismaService],
})
export class AdminCompaniesModule { }
