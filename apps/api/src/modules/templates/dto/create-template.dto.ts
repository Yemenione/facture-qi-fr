import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, IsHexColor, IsInt, Min, Max } from 'class-validator';

export enum TemplateType {
    CLASSIC = 'CLASSIC',
    MODERN = 'MODERN',
    ELEGANT = 'ELEGANT',
    COLORFUL = 'COLORFUL'
}

export enum LogoPosition {
    LEFT = 'LEFT',
    CENTER = 'CENTER',
    RIGHT = 'RIGHT'
}

export enum HeaderStyle {
    MINIMAL = 'MINIMAL',
    DETAILED = 'DETAILED',
    BANNER = 'BANNER'
}

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(TemplateType)
    @IsOptional()
    type?: TemplateType;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;

    // Colors
    @IsHexColor()
    @IsOptional()
    primaryColor?: string;

    @IsHexColor()
    @IsOptional()
    secondaryColor?: string;

    @IsHexColor()
    @IsOptional()
    textColor?: string;

    @IsHexColor()
    @IsOptional()
    backgroundColor?: string;

    // Logo
    @IsString()
    @IsOptional()
    logoUrl?: string;

    @IsEnum(LogoPosition)
    @IsOptional()
    logoPosition?: LogoPosition;

    @IsInt()
    @Min(50)
    @Max(500)
    @IsOptional()
    logoWidth?: number;

    // Typography
    @IsString()
    @IsOptional()
    fontFamily?: string;

    @IsInt()
    @Min(8)
    @Max(72)
    @IsOptional()
    headerFontSize?: number;

    @IsInt()
    @Min(8)
    @Max(30)
    @IsOptional()
    bodyFontSize?: number;

    // Layout
    @IsEnum(HeaderStyle)
    @IsOptional()
    headerStyle?: HeaderStyle;

    @IsBoolean()
    @IsOptional()
    showFooter?: boolean;

    @IsString()
    @IsOptional()
    footerText?: string;

    @IsString()
    @IsOptional()
    legalMentions?: string;

    @IsString()
    @IsOptional()
    paymentTermsText?: string;
}
