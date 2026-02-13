import { Role } from '@prisma/client';
export declare class AddUserDto {
    name: string;
    email: string;
    role?: Role;
    groupId?: number;
    password?: string;
}
