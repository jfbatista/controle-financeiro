import { useAuthApi } from './authFetch';

export interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

export interface UserCompany extends User {
    // The endpoint returns UserCompany objects which contain the user and the role
    userId: number;
    companyId: number;
    role?: string; // Deprecated
    group?: { id: number; name: string };
    user: User;
}

export interface CreateUserDto {
    name: string;
    email: string;
    role?: string;
    groupId?: number;
    password?: string;
}

export function useUsersService() {
    const api = useAuthApi();

    return {
        findAll: async () => {
            return api.get<UserCompany[]>('/users');
        },

        addUser: async (dto: CreateUserDto) => {
            return api.post<UserCompany>('/users', dto);
        },

        removeUser: async (id: number) => {
            return api.del<void>(`/users/${id}`);
        },

        updateUserGroup: async (id: number, groupId: number) => {
            return api.patch<UserCompany>(`/users/${id}/group`, { groupId });
        }
    };
}
