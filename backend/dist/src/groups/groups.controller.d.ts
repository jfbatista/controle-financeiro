import { GroupsService } from './groups.service';
import { Permission } from '../auth/permissions';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    findAll(user: CurrentUserData): Promise<({
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
    create(user: CurrentUserData, body: {
        name: string;
        permissions: Permission[];
    }): Promise<{
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
    update(user: CurrentUserData, id: number, body: {
        name: string;
        permissions: Permission[];
    }): Promise<({
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
    remove(user: CurrentUserData, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
    }>;
}
