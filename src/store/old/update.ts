import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {api} from '@/client/api';
import {getClientConfig} from '@/config/client';
import {StoreKey} from '@/constant';

export interface UpdateStore {
  lastUpdate: number;
  remoteVersion: string;

  used?: number;
  subscription?: number;
  lastUpdateUsage: number;

  version: string;
  getLatestVersion: (force?: boolean) => Promise<void>;
  updateUsage: (force?: boolean) => Promise<void>;
}

const ONE_MINUTE = 60 * 1000;

export const useUpdateStore = create<UpdateStore>()(
  persist(
    (set, get) => ({
      lastUpdate: 0,
      remoteVersion: '',

      lastUpdateUsage: 0,

      version: 'unknown',

      async getLatestVersion(force = false) {
        set(() => ({version: getClientConfig()?.commitId ?? 'unknown'}));

        const overTenMins = Date.now() - get().lastUpdate > 10 * ONE_MINUTE;
        if (!force && !overTenMins) return;

        set(() => ({
          lastUpdate: Date.now(),
        }));
      },

      async updateUsage(force = false) {
        const overOneMinute = Date.now() - get().lastUpdateUsage >= ONE_MINUTE;
        if (!overOneMinute && !force) return;

        set(() => ({
          lastUpdateUsage: Date.now(),
        }));

        try {
          const usage = await api.llm.usage();

          if (usage) {
            set(() => ({
              used: usage.used,
              subscription: usage.total,
            }));
          }
        } catch (e) {
          console.error((e as Error).message);
        }
      },
    }),
    {
      name: StoreKey.Update,
      version: 1,
    },
  ),
);
