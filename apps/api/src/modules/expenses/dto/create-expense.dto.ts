import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateExpenseDto {
    @IsString()
    description: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsDateString()
    date: string;

    @IsString()
    supplier: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumber()
    vatAmount?: number;

    @IsOptional()
    @IsString()
    proofUrl?: string;
}
