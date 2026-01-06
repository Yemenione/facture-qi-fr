import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: { plan: true }
        });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async findAll() {
        return this.prisma.company.findMany({
            include: { plan: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByFirm(firmId: string) {
        return this.prisma.company.findMany({
            where: { accountantFirmId: firmId },
            include: { plan: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
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
                siret: updateCompanyDto.siret,
                vatNumber: updateCompanyDto.vatNumber,
                email: updateCompanyDto.email,
                phone: updateCompanyDto.phone,
                logoUrl: updateCompanyDto.logoUrl,
                address: addressData,
                vatSystem: updateCompanyDto.vatSystem,
                // Extended Data
                legalForm: updateCompanyDto.legalForm,
                nafCode: updateCompanyDto.nafCode,
                activityLabel: updateCompanyDto.activityLabel,
                managerName: updateCompanyDto.managerName,
                rcsNumber: updateCompanyDto.rcsNumber,
                creationDate: updateCompanyDto.creationDate ? new Date(updateCompanyDto.creationDate) : undefined,
                category: updateCompanyDto.category,
            },
        });
    }

    async updateLogo(id: string, logoUrl: string) {
        return this.prisma.company.update({
            where: { id },
            data: { logoUrl },
        });
    }

    async searchSiret(siret: string) {
        try {
            // Using API Gouv (Free, Open)
            const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siret}&limit=1`);
            if (!response.ok) return null;

            const data: any = await response.json();
            if (!data.results || data.results.length === 0) return null;

            const result = data.results[0];
            const siren = result.siren;

            // Calculate Intra-community VAT Number
            // Algo: Key = [ 12 + 3 * ( SIREN % 97 ) ] % 97
            const sirenNum = parseInt(siren, 10);
            const key = (12 + 3 * (sirenNum % 97)) % 97;
            const vatNumber = `FR${key.toString().padStart(2, '0')}${siren}`;

            return {
                name: result.nom_complet,
                siren: siren,
                siret: result.siret || (result.siege ? result.siege.siret : null),
                vatNumber: vatNumber,
                address: result.siege.geo_adresse,
                street: result.siege.libelle_voie ? `${result.siege.numero_voie || ''} ${result.siege.libelle_voie}`.trim() : result.siege.geo_adresse,
                city: result.siege.libelle_commune,
                zipCode: result.siege.code_postal,
                // New Fields mapping from API Gouv
                legalForm: result.nature_juridique,
                nafCode: result.activite_principale,
                activityLabel: result.libelle_activite_principale,
                creationDate: result.date_creation,
                category: result.categorie_entreprise,
                // Manager logic - API Gouv might return 'dirigeants' array
                managerName: result.dirigeants && result.dirigeants.length > 0
                    ? `${result.dirigeants[0].prenom || ''} ${result.dirigeants[0].nom || ''}`.trim()
                    : null,
            };
        } catch (error) {
            console.error("Error searching SIRET:", error);
            return null;
        }
    }
}
