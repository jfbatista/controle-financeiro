import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { httpPost } from '../services/http';
import { Permission } from '../config/permissions';
import type { Role } from '../config/permissions';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  can: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      async login(email: string, password: string) {
        set({ loading: true, error: null });
        try {
          const data = await httpPost<AuthResponse, { email: string; password: string }>(
            '/auth/login',
            { email, password },
          );
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            loading: false,
            error: null,
          });
        } catch (e: any) {
          set({
            loading: false,
            error: e?.message || 'Erro ao fazer login',
          });
        }
      },

      logout() {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
          error: null,
        });
      },

      clearError() {
        set({ error: null });
      },

      can(permission: Permission) {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

