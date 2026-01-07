import { Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';
import { ReconciliationService } from './reconciliation.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BankingController],
    providers: [BankingService, ReconciliationService],
    exports: [BankingService, ReconciliationService]
})
export class BankingModule { }
