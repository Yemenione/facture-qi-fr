import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    create(companyId: string, data: CreateClientDto) {
        return this.prisma.client.create({
            data: {
                ...data,
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
