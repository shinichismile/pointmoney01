import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  customIcon?: string;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User & { profile: UserProfile }>) => void;
  updateIcon: (base64: string) => void;
  updateAvatar: (avatarUrl: string) => void;
}

// Mock users for demonstration
const MOCK_USERS = [
  { 
    id: '1', 
    loginId: 'kkkk2222', 
    email: 'worker@pointmoney.com', 
    password: 'kkkk2222', 
    name: '山田 太郎', 
    role: 'worker', 
    points: 0 
  },
  { 
    id: '2', 
    loginId: 'kkkk1111', 
    email: 'admin@pointmoney.com', 
    password: 'kkkk1111', 
    name: '鈴木 管理者', 
    role: 'admin' 
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      customIcon: undefined,
      login: (user) => set({ 
        user: { 
          ...user, 
          lastLogin: new Date().toISOString() 
        }, 
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      updateIcon: (base64) => set({ customIcon: base64 }),
      updateAvatar: (avatarUrl) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export mock users for authentication
export const authenticateUser = (identifier: string, password: string) => {
  const user = MOCK_USERS.find(
    (u) => (u.email === identifier || u.loginId === identifier) && u.password === password
  );
  
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};