import { Module } from '@nestjs/common';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { AdminSubscriptionsController } from './admin-subscriptions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminSubscriptionsController],
    providers: [AdminSubscriptionsService],
})
export class AdminSubscriptionsModule { }
