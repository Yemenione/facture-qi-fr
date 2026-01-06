import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AdminUsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            include: { company: { select: { name: true } } }
        });
    }

    async update(id: string, data: any) {
        const updateData: any = { ...data };

        // Handle Password Reset if provided
        if (updateData.password) {
            updateData.password = await argon2.hash(updateData.password);
        } else {
            delete updateData.password;
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        // Prevent deleting the last owner of a company? 
        // For God Mode, we allow it, but maybe warn?
        return this.prisma.user.delete({
            where: { id }
        });
    }
}
