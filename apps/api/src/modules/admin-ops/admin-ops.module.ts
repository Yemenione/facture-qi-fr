import { Module } from '@nestjs/common';
import { AdminOpsService } from './admin-ops.service';
import { AdminOpsController } from './admin-ops.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [AdminOpsController],
    providers: [AdminOpsService, PrismaService],
})
export class AdminOpsModule { }
