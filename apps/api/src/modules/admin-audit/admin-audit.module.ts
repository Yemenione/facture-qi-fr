import { Module, Global } from '@nestjs/common';
import { AdminAuditService } from './admin-audit.service';
import { AdminAuditController } from './admin-audit.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Global() // Make it global so other modules can inject service easily to log actions
@Module({
    imports: [PrismaModule],
    controllers: [AdminAuditController],
    providers: [AdminAuditService],
    exports: [AdminAuditService]
})
export class AdminAuditModule { }
