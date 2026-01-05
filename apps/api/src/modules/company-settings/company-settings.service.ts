import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanySettingsService {
    constructor(private prisma: PrismaService) { }

    async get(companyId: string) {
        let settings = await this.prisma.companySettings.findUnique({
            where: { companyId },
        });

        // Create default settings if they don't exist
        if (!settings) {
            const company = await this.prisma.company.findUnique({
                where: { id: companyId },
            });

            settings = await this.prisma.companySettings.create({
                data: {
                    companyId,
                    legalName: company.name,
                    legalForm: company.legalForm || 'SARL',
                    siret: company.siret || '',
                    vatNumber: company.vatNumber,
                    address: typeof company.address === 'object' ? (company.address as any).street || '' : '',
                    postalCode: typeof company.address === 'object' ? (company.address as any).zip || '' : '',
                    city: typeof company.address === 'object' ? (company.address as any).city || '' : '',
                    email: company.email || '',
                    phone: company.phone || '',
                },
            });
        }

        return settings;
    }

    async update(data: any, companyId: string) {
        // Check if settings exist
        const existing = await this.prisma.companySettings.findUnique({
            where: { companyId },
        });

        if (existing) {
            return this.prisma.companySettings.update({
                where: { companyId },
                data,
            });
        } else {
            return this.prisma.companySettings.create({
                data: {
                    ...data,
                    companyId,
                },
            });
        }
    }
}
