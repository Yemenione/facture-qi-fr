import { Module } from '@nestjs/common';
import { AdminMarketingService } from './admin-marketing.service';
import { AdminMarketingController } from './admin-marketing.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AdminMarketingService],
    controllers: [AdminMarketingController],
})
export class AdminMarketingModule { }
