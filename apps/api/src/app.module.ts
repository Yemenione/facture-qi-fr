import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { StatsModule } from './modules/stats/stats.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';
import { AdminCompaniesModule } from './modules/admin-companies/admin-companies.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['../../.env', '.env'],
        }),
        AuthModule,
        InvoicesModule,
        ClientsModule,
        UsersModule,
        ProductsModule,
        CompaniesModule,
        PdfModule,
        StatsModule,
        AdminAuthModule,
        AdminCompaniesModule,
    ],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule { }
