import { Module } from '@nestjs/common';
import { AdminBroadcastService } from './admin-broadcast.service';
import { AdminBroadcastController } from './admin-broadcast.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminBroadcastController],
    providers: [AdminBroadcastService],
})
export class AdminBroadcastModule { }
