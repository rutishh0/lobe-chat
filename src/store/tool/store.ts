import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ToolStoreItem } from '../../types/tool';
import { createToolStoreSlice } from './slices/store/action';

export interface ToolStore {
  // State
  installedPlugins: ToolStoreItem[];
  pluginStoreList: ToolStoreItem[];
  pluginInstallLoading: Record<string, boolean>;
}

const initialState: ToolStore = {
  installedPlugins: [],
  pluginStoreList: [],
  pluginInstallLoading: {},
};

export const useToolStore = create<ToolStore>()(
  devtools(
    () => ({
      ...initialState,
      ...createToolStoreSlice(),
    }),
    { name: 'ToolStore' }
  )
);

export const getToolStoreState = () => useToolStore.getState();
