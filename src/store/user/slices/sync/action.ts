import type { StateCreator } from 'zustand/vanilla';

import { useClientDataSWR, type SWRResponse } from '@/libs/swr';
import type { UserStore } from '@/store/user';
import type { SyncStatus } from '@/types/sync';

export interface SyncAction {
  useSyncStatus: () => SWRResponse<SyncStatus>;
}

const FETCH_SYNC_STATUS_KEY = 'fetchSyncStatus';

export const createSyncSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  SyncAction
> = () => ({
  useSyncStatus: () =>
    useClientDataSWR(
      FETCH_SYNC_STATUS_KEY,
      async () => {
        try {
          // In a real implementation, this would fetch from an API
          return {
            lastSyncTime: Date.now(),
            status: 'success',
          } as SyncStatus;
        } catch {
          return {
            lastSyncTime: null,
            status: 'error',
          } as SyncStatus;
        }
      },
      {
        revalidateOnFocus: false,
      },
    ),
});
