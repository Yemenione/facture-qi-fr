import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
import { AdminOpsModule } from './modules/admin-ops/admin-ops.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { AdminVerificationModule } from './modules/admin-verification/admin-verification.module';
import { SupportModule } from './modules/support/support.module';
import { AdminBroadcastModule } from './modules/admin-broadcast/admin-broadcast.module';
import { AdminSubscriptionsModule } from './modules/admin-subscriptions/admin-subscriptions.module';
import { AdminAuditModule } from './modules/admin-audit/admin-audit.module';
import { AdminMarketingModule } from './modules/admin-marketing/admin-marketing.module';
import { CronModule } from './modules/cron/cron.module';
import { DataOpsModule } from './modules/data-ops/data-ops.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { MailModule } from './modules/mail/mail.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { CompanySettingsModule } from './modules/company-settings/company-settings.module';
import { ExportsModule } from './modules/exports/exports.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { DunningModule } from './modules/dunning/dunning.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['../../.env', '.env'],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        PrismaModule,
        AuthModule,
        InvoicesModule,
        ClientsModule,
        UsersModule,
        ProductsModule,
        CompaniesModule,
        PdfModule,
        DataOpsModule,
        ApiKeysModule,
        SubscriptionsModule,
        ExpensesModule,
        StatsModule,
        AdminAuthModule,
        AdminCompaniesModule,
        AdminOpsModule,
        AdminUsersModule,
        AdminVerificationModule,
        SupportModule,
        AdminBroadcastModule,
        AdminSubscriptionsModule,
        AdminAuditModule,
        AdminMarketingModule,
        TemplatesModule,
        CompanySettingsModule,
        MailModule,
        ExportsModule,
        AccountingModule,
        DunningModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
