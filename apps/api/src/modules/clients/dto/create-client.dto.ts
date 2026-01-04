import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateClientDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    isBusiness?: boolean;

    @IsOptional()
    @IsString()
    siren?: string;

    @IsOptional()
    @IsString()
    vatNumber?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    address?: any;
}
