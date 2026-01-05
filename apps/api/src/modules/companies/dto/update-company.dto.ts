import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateCompanyDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    siren?: string;

    @IsString()
    @IsOptional()
    siret?: string;

    @IsString()
    @IsOptional()
    vatNumber?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    capital?: string;

    @IsString()
    @IsOptional()
    rcs?: string;

    @IsString()
    @IsOptional()
    iban?: string;

    @IsString()
    @IsOptional()
    bic?: string;

    @IsString()
    @IsOptional()
    legalMentions?: string;

    @IsString()
    @IsOptional()
    penalties?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    zipCode?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    logoUrl?: string;

    @IsString()
    @IsOptional()
    vatSystem?: string;

    @IsString()
    @IsOptional()
    legalForm?: string;

    @IsString()
    @IsOptional()
    nafCode?: string;

    @IsString()
    @IsOptional()
    activityLabel?: string;

    @IsString()
    @IsOptional()
    managerName?: string;

    @IsString()
    @IsOptional()
    rcsNumber?: string;

    @IsString()
    @IsOptional()
    creationDate?: string; // ISO String

    @IsString()
    @IsOptional()
    category?: string;
}
