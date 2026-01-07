
import { Module } from '@nestjs/common';
import { AccountingController } from './accounting.controller';
import { FecService } from './fec.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AccountingController],
    providers: [FecService],
})
export class AccountingModule { }
