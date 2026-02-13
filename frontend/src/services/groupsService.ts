import { useAuthApi } from './authFetch';
import { Permission } from '../config/permissions';

export interface Group {
    id: number;
    name: string;
    permissions: { permission: Permission }[];
}

export interface CreateGroupDto {
    name: string;
    permissions: Permission[];
}

export interface UpdateGroupDto {
    name: string;
    permissions: Permission[];
}

export function useGroupsService() {
    const api = useAuthApi();

    return {
        getAll: async () => {
            return api.get<Group[]>('/groups');
        },

        create: async (data: CreateGroupDto) => {
            return api.post<Group>('/groups', data);
        },

        update: async (id: number, data: UpdateGroupDto) => {
            return api.put<Group>(`/groups/${id}`, data);
        },

        delete: async (id: number) => {
            return api.del<void>(`/groups/${id}`);
        },
    };
}
