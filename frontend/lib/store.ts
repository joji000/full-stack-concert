import { create } from 'zustand';

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  showToast: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'success',
  showToast: (message, severity = 'success') => set({ open: true, message, severity }),
  hideToast: () => set({ open: false }),
}));

interface AuthState {
  userId: number | null;
  role: 'ADMIN' | 'USER' | null;
  setAuth: (userId: number, role: 'ADMIN' | 'USER') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: typeof window !== 'undefined' ? Number(localStorage.getItem('currentUserId')) || null : null,
  role: typeof window !== 'undefined' ? (localStorage.getItem('currentUserRole') as 'ADMIN' | 'USER') || null : null,
  setAuth: (userId, role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUserId', userId.toString());
      localStorage.setItem('currentUserRole', role);
    }
    set({ userId, role });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUserRole');
    }
    set({ userId: null, role: null });
  },
}));