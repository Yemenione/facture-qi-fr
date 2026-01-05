import { IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
    @IsString()
    @IsOptional()
    street?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    zip?: string;

    @IsString()
    @IsOptional()
    country?: string;
}

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    isBusiness?: boolean;

    @IsString()
    @IsOptional()
    siren?: string;

    @IsString()
    @IsOptional()
    siret?: string;

    @IsString()
    @IsOptional()
    legalForm?: string;

    @IsString()
    @IsOptional()
    nafCode?: string;

    @IsString()
    @IsOptional()
    vatSystem?: string;

    @IsString()
    @IsOptional()
    vatNumber?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;
}
