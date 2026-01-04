import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
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
}
