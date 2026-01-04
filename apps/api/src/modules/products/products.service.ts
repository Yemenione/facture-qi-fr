import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    create(companyId: string, createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                companyId,
            },
        });
    }

    findAll(companyId: string) {
        return this.prisma.product.findMany({
            where: { companyId },
        });
    }

    findOne(companyId: string, id: string) {
        return this.prisma.product.findFirst({
            where: { id, companyId },
        });
    }

    update(companyId: string, id: string, updateProductDto: Partial<CreateProductDto>) {
        return this.prisma.product.updateMany({
            where: { id, companyId },
            data: updateProductDto,
        });
    }

    remove(companyId: string, id: string) {
        return this.prisma.product.deleteMany({
            where: { id, companyId },
        });
    }
}
