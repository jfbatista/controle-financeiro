import { GroupsService } from './groups.service';
import { Permission } from '../auth/permissions';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    findAll(user: CurrentUserData): Promise<any>;
    create(user: CurrentUserData, body: {
        name: string;
        permissions: Permission[];
    }): Promise<any>;
    update(user: CurrentUserData, id: number, body: {
        name: string;
        permissions: Permission[];
    }): Promise<any>;
    remove(user: CurrentUserData, id: number): Promise<any>;
}
