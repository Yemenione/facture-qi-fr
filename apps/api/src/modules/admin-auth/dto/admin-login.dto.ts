import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
