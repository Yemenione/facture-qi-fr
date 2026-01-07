import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaModule } from '../../prisma/prisma.module';

import { AutomationModule } from '../automation/automation.module';

@Module({
    imports: [PrismaModule, AutomationModule],
    controllers: [ExpensesController],
    providers: [ExpensesService],
})
export class ExpensesModule { }
