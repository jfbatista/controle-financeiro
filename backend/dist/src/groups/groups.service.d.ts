import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '../auth/permissions';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, name: string, permissions: Permission[]): Promise<{
        permissions: {
            id: number;
            groupId: number;
            permission: string;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    }>;
    findAll(companyId: number): Promise<({
        permissions: {
            id: number;
            groupId: number;
            permission: string;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    })[]>;
    findOne(id: number): Promise<({
        permissions: {
            id: number;
            groupId: number;
            permission: string;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    }) | null>;
    update(id: number, name: string, permissions: Permission[]): Promise<({
        permissions: {
            id: number;
            groupId: number;
            permission: string;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    }) | null>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    }>;
    ensureDefaultGroups(companyId: number): Promise<void>;
    getUserPermissions(userId: number, companyId: number): Promise<string[]>;
}
