import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createFirstUser(dto: CreateUserDto): Promise<{
        user: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            isActive: boolean;
        };
        company: {
            id: number;
            name: string;
            document: string | null;
            contactEmail: string | null;
            ownerUserId: number;
            createdAt: Date;
            updatedAt: Date;
            smtpHost: string | null;
            smtpPort: number | null;
            smtpUser: string | null;
            smtpPass: string | null;
            smtpSecure: boolean;
            smtpFrom: string | null;
        };
    }>;
    findByEmail(email: string): Promise<({
        memberships: ({
            company: {
                id: number;
                name: string;
                document: string | null;
                contactEmail: string | null;
                ownerUserId: number;
                createdAt: Date;
                updatedAt: Date;
                smtpHost: string | null;
                smtpPort: number | null;
                smtpUser: string | null;
                smtpPass: string | null;
                smtpSecure: boolean;
                smtpFrom: string | null;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            companyId: number;
            role: import("@prisma/client").$Enums.Role;
            groupId: number | null;
        })[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        isActive: boolean;
    }) | null>;
    findById(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        isActive: boolean;
    } | null>;
    findAllByCompany(companyId: number): Promise<({
        user: {
            id: number;
            name: string;
            email: string;
            isActive: boolean;
        };
        group: {
            id: number;
            name: string;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    })[]>;
    addUserToCompany(companyId: number, dto: {
        name: string;
        email: string;
        role?: Role;
        groupId?: number;
        password?: string;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
    removeUserFromCompany(companyId: number, userId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
    updateUserGroup(companyId: number, userId: number, groupId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
}
