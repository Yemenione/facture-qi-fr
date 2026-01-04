import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    create(companyId: string, data: CreateClientDto) {
        return this.prisma.client.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                isBusiness: data.isBusiness ?? true,
                siren: data.siren,
                vatNumber: data.vatNumber,
                address: data.address || {},
                companyId,
            }
        });
    }

    findAll(companyId: string) {
        return this.prisma.client.findMany({
            where: { companyId }
        });
    }

    findOne(companyId: string, id: string) {
        return this.prisma.client.findFirst({
            where: { id, companyId }
        });
    }
}
