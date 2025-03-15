import { DeepPartial } from 'utility-types';
import type { StateCreator } from 'zustand/vanilla';

import { DEFAULT_PREFERENCE } from '@/const/user';
import { useClientDataSWR, mutate, type SWRResponse } from '@/libs/swr';
import { userService } from '@/services/user';
import type { UserStore } from '@/store/user';
import type { GlobalServerConfig } from '@/types/serverConfig';
import type { UserPreference } from '@/types/user';

export interface CommonAction {
  useCheckUserExist: () => SWRResponse<boolean>;
  useUserConfig: () => SWRResponse<GlobalServerConfig>;
  useUserPreference: () => SWRResponse<UserPreference>;
  updatePreference: (value: DeepPartial<UserPreference>) => Promise<void>;
}

const FETCH_USER_CONFIG_KEY = 'fetchUserConfig';
const FETCH_USER_PREFERENCE_KEY = 'fetchUserPreference';
const CHECK_USER_EXIST_KEY = 'checkUserExist';

export const createCommonSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  CommonAction
> = () => ({
  useCheckUserExist: () =>
    useClientDataSWR(CHECK_USER_EXIST_KEY, async () => {
      try {
        return await userService.checkUserExist();
      } catch {
        return false;
      }
    }),

  useUserConfig: () =>
    useClientDataSWR(
      FETCH_USER_CONFIG_KEY,
      async () => {
        try {
          return await userService.getUserConfig();
        } catch {
          return {} as GlobalServerConfig;
        }
      },
      {
        revalidateOnFocus: false,
      },
    ),

  useUserPreference: () =>
    useClientDataSWR(
      FETCH_USER_PREFERENCE_KEY,
      async () => {
        try {
          return await userService.getUserPreference();
        } catch {
          return DEFAULT_PREFERENCE;
        }
      },
      {
        revalidateOnFocus: false,
      },
    ),

  updatePreference: async (value) => {
    await userService.updateUserPreference(value);
    await mutate(FETCH_USER_PREFERENCE_KEY);
  },
});
