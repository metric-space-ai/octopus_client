import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {IAuthData} from '@/types';

interface AuthStore {
  authData: IAuthData | null;
  setAuthData: (data: IAuthData | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authData: null,
      setAuthData(data: IAuthData | null) {
        set({authData: data});
      },
    }),
    {
      name: 'AuthStore',
    },
  ),
);
