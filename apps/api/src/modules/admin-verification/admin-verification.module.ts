import { Module } from '@nestjs/common';
import { AdminVerificationService } from './admin-verification.service';
import { AdminVerificationController } from './admin-verification.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminVerificationController],
    providers: [AdminVerificationService],
})
export class AdminVerificationModule { }
