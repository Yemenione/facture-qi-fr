export class CreateClientDto {
    name: string;
    email: string;
    isBusiness: boolean;
    siren?: string;
    vatNumber?: string;
    address: any;
}
