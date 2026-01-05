import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplatesService {
    constructor(private prisma: PrismaService) { }

    async findAll(companyId: string) {
        return this.prisma.invoiceTemplate.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, companyId: string) {
        const template = await this.prisma.invoiceTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            throw new NotFoundException('Template not found');
        }

        if (template.companyId !== companyId) {
            throw new ForbiddenException('Access denied');
        }

        return template;
    }

    async create(data: any, companyId: string) {
        return this.prisma.invoiceTemplate.create({
            data: {
                ...data,
                companyId,
            },
        });
    }

    async update(id: string, data: any, companyId: string) {
        // Verify ownership
        await this.findOne(id, companyId);

        return this.prisma.invoiceTemplate.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, companyId: string) {
        // Verify ownership
        await this.findOne(id, companyId);

        return this.prisma.invoiceTemplate.delete({
            where: { id },
        });
    }

    async setDefault(id: string, companyId: string) {
        // Verify ownership
        await this.findOne(id, companyId);

        // Remove default from all other templates
        await this.prisma.invoiceTemplate.updateMany({
            where: { companyId, isDefault: true },
            data: { isDefault: false },
        });

        // Set this template as default
        return this.prisma.invoiceTemplate.update({
            where: { id },
            data: { isDefault: true },
        });
    }

    async getDefault(companyId: string) {
        const defaultTemplate = await this.prisma.invoiceTemplate.findFirst({
            where: { companyId, isDefault: true },
        });

        if (!defaultTemplate) {
            // Return first template or create a default one
            const firstTemplate = await this.prisma.invoiceTemplate.findFirst({
                where: { companyId },
            });

            if (firstTemplate) {
                return this.setDefault(firstTemplate.id, companyId);
            }

            // Create default template
            return this.create({
                name: 'Template par défaut',
                type: 'CLASSIC',
                isDefault: true,
            }, companyId);
        }

        return defaultTemplate;
    }
}
