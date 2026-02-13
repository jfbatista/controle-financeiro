import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class AddUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsInt()
    groupId?: number;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
