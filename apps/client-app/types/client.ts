export interface Client {
    id: string;
    companyId: string;
    name: string;
    isBusiness: boolean;
    siren?: string;
    vatNumber?: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        zip?: string;
        country?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateClientDto {
    name: string;
    isBusiness: boolean;
    siren?: string;
    vatNumber?: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        zip?: string;
        country?: string;
    };
}
