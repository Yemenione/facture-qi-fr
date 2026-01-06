import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    vatRate: number;
}

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsString()
    clientId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @IsOptional()
    @IsString()
    type?: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE'; // Using string union to avoid importing backend enum if tricky, or stick to string for DTO simplicity

    @IsOptional()
    @Type(() => Date)
    validityDate?: Date;

    @IsOptional()
    @Type(() => Date)
    issueDate?: Date;

    @IsOptional()
    @Type(() => Date)
    dueDate?: Date;

    @IsOptional()
    @IsString()
    notes?: string;
}
