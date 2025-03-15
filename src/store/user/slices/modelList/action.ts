import { produce } from 'immer';
import type { StateCreator } from 'zustand/vanilla';

import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';
import { useClientDataSWR, type SWRResponse } from '@/libs/swr';
import type { UserStore } from '@/store/user';
import type { ModelProvider } from '@/types/modelProvider';

export interface ModelListAction {
  useModelProviderList: () => SWRResponse<ModelProvider[]>;
  updateModelProviderList: (providers: ModelProvider[]) => void;
}

const FETCH_MODEL_PROVIDER_LIST_KEY = 'fetchModelProviderList';

export const createModelListSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  ModelListAction
> = (set) => ({
  useModelProviderList: () =>
    useClientDataSWR(
      FETCH_MODEL_PROVIDER_LIST_KEY,
      async () => {
        try {
          // In a real implementation, this would fetch from an API
          return DEFAULT_MODEL_PROVIDER_LIST;
        } catch {
          return DEFAULT_MODEL_PROVIDER_LIST;
        }
      },
      {
        revalidateOnFocus: false,
      },
    ),

  updateModelProviderList: (providers) => {
    set(
      produce((state: UserStore) => {
        state.modelProviderList = providers;
      }),
      false,
      'updateModelProviderList',
    );
  },
});
