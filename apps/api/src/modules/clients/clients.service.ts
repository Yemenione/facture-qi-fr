import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createClientDto: CreateClientDto) {
        // Get user's company
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.error(`User not found: ${userId}`);
            throw new NotFoundException('User not found');
        }

        console.log('Creating client for company:', user.companyId, 'Payload:', JSON.stringify(createClientDto));

        try {
            return await this.prisma.client.create({
                data: {
                    ...createClientDto,
                    companyId: user.companyId,
                    address: (createClientDto.address || {}) as any, // Save as JSON
                },
            });
        } catch (error) {
            console.error("DETAILED ERROR creating client:", error);
            // Using BadRequestException to ensure the message is shown to the user
            throw new BadRequestException(`Failed to create client: ${error.message}`);
        }
    }

    async findAll(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.client.findMany({
            where: { companyId: user.companyId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const client = await this.prisma.client.findFirst({
            where: { id, companyId: user.companyId },
        });

        if (!client) throw new NotFoundException('Client not found');
        return client;
    }

    async update(id: string, userId: string, updateClientDto: UpdateClientDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check exist ownership
        const exists = await this.prisma.client.findFirst({
            where: { id, companyId: user.companyId },
        });
        if (!exists) throw new NotFoundException('Client not found');

        return this.prisma.client.update({
            where: { id },
            data: {
                ...updateClientDto,
                address: (updateClientDto.address ? updateClientDto.address : undefined) as any,
            },
        });
    }

    async remove(id: string, userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const exists = await this.prisma.client.findFirst({
            where: { id, companyId: user.companyId },
        });
        if (!exists) throw new NotFoundException('Client not found');

        return this.prisma.client.delete({
            where: { id },
        });
    }
}
