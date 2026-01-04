import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        InvoicesModule,
    ],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule { }
