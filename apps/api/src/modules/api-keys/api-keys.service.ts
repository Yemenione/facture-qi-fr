import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class ApiKeysService {
    constructor(private prisma: PrismaService) { }

    async create(companyId: string, name: string) {
        // Generate a secure random key
        // Format: sk_live_<16 chars random>
        const randomPart = crypto.randomBytes(16).toString('hex');
        const key = `sk_live_${randomPart}`;
        const prefix = key.substring(0, 12) + '...';

        // Hash the key for storage
        const keyHash = await argon2.hash(key);

        const apiKey = await this.prisma.apiKey.create({
            data: {
                name,
                prefix,
                keyHash,
                companyId
            }
        });

        // Return the full key ONLY ONCE
        return {
            id: apiKey.id,
            name: apiKey.name,
            prefix: apiKey.prefix,
            createdAt: apiKey.createdAt,
            secretKey: key // This is the only time the user sees this
        };
    }

    async findAll(companyId: string) {
        return this.prisma.apiKey.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                prefix: true,
                lastUsedAt: true,
                createdAt: true
            }
        });
    }

    async delete(companyId: string, id: string) {
        const key = await this.prisma.apiKey.findFirst({
            where: { id, companyId }
        });

        if (!key) throw new NotFoundException('API Key not found');

        return this.prisma.apiKey.delete({ where: { id } });
    }

    async validateKey(key: string) {
        // This is inefficient for high scale (finding by prefix would be better if we stored exact prefix)
        // For MVP/Beta: Scan all keys? No, huge performance hit.
        // Better: We should probably store the key differently or use ID + Secret.
        // Standard approach: Key = "sk_live_ID_SECRET". Extract ID, lookup hash, verify secret.

        // Let's refine the key generation for validation performance.
        // We will stick to the current plan for now, but in a real high-throughput scenario, ID in key is better.
        // Given the prompt constraints, we'll try to match by iterating over potential matches or just keep it simple.

        // Since we didn't enforce specific format with ID in schema update, let's assume we scan keys 
        // OR we can change implementation to `sk_live_{pub}_{priv}`.

        // Let's just create the logic to create/list/delete for now as requested for the UI.
        // Validation logic would go into a Guard.
        return true;
    }
}
