import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        // Handle address update separately if needed, or assume simpler schema for now
        // For compliance, address usually needs better structure but we'll map fields to JSON or standard fields

        // Construct address object if using JSON field
        const addressData = {
            street: updateCompanyDto.address,
            city: updateCompanyDto.city,
            zipCode: updateCompanyDto.zipCode,
            country: updateCompanyDto.country,
        };

        return this.prisma.company.update({
            where: { id },
            data: {
                name: updateCompanyDto.name,
                siren: updateCompanyDto.siren,
                vatNumber: updateCompanyDto.vatNumber,
                email: updateCompanyDto.email,
                phone: updateCompanyDto.phone,
                logoUrl: updateCompanyDto.logoUrl,
                address: addressData, // Updating the JSON column
            },
        });
    }
}
