import { Module } from '@nestjs/common';
import { DataOpsService } from './data-ops.service';
import { DataOpsController } from './data-ops.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [DataOpsService],
    controllers: [DataOpsController],
    exports: [DataOpsService]
})
export class DataOpsModule { }
