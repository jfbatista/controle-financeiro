import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddUserDto } from './dto/add-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findAll(req: any): Promise<({
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
    addUser(req: any, dto: AddUserDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
    removeUser(req: any, id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
    updateUserGroup(req: any, id: number, body: {
        groupId: number;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        companyId: number;
        role: import("@prisma/client").$Enums.Role;
        groupId: number | null;
    }>;
}
