import { Module } from '@nestjs/common';
import { DunningController } from './dunning.controller';
import { DunningService } from './dunning.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DunningController],
    providers: [DunningService],
})
export class DunningModule { }
