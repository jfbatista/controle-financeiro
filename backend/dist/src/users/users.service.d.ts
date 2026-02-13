import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createFirstUser(dto: CreateUserDto): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findById(id: number): Promise<any>;
    findAllByCompany(companyId: number): Promise<any>;
    addUserToCompany(companyId: number, dto: {
        name: string;
        email: string;
        role?: Role;
        groupId?: number;
        password?: string;
    }): Promise<any>;
    removeUserFromCompany(companyId: number, userId: number): Promise<any>;
    updateUserGroup(companyId: number, userId: number, groupId: number): Promise<any>;
}
