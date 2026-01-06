
import { Module } from '@nestjs/common';
import { ExportsController } from './exports.controller';
import { FecService } from './fec.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ExportsController],
    providers: [FecService]
})
export class ExportsModule { }
