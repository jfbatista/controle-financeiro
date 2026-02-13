import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '../auth/permissions';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, name: string, permissions: Permission[]): Promise<any>;
    findAll(companyId: number): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, name: string, permissions: Permission[]): Promise<any>;
    remove(companyId: number, id: number): Promise<any>;
    ensureDefaultGroups(companyId: number): Promise<void>;
    getUserPermissions(userId: number, companyId: number): Promise<string[]>;
}
