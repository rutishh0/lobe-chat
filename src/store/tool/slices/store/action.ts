import { StateCreator } from 'zustand/vanilla';

import { notification } from '@/components/AntdStaticMethods';
import { DEFAULT_TOOL_STORE_DATA, isValidToolType } from '../../../../const/tool';
import { useClientDataSWR, type SWRResponse, mutate } from '../../../../libs/swr';
import { toolService } from '../../../../services/tool';
import type { ToolStore } from '../../store';
import type { ToolStoreItem } from '../../../../types/tool';

const FETCH_TOOL_STORE_KEY = 'fetchToolStore';

const translate = {
  installing: 'Installing...',
  toolInstalling: 'Installing tool...',
  installSuccess: 'Installation successful',
  toolInstallSuccess: 'Tool installed successfully',
  installFailed: 'Installation failed',
  toolInstallFailed: 'Tool installation failed',
  uninstalling: 'Uninstalling...',
  toolUninstalling: 'Uninstalling tool...',
  uninstallSuccess: 'Uninstallation successful',
  toolUninstallSuccess: 'Tool uninstalled successfully',
  uninstallFailed: 'Uninstallation failed',
  toolUninstallFailed: 'Tool uninstallation failed',
  updating: 'Updating...',
  toolUpdating: 'Updating tool...',
  updateSuccess: 'Update successful',
  toolUpdateSuccess: 'Tool updated successfully',
  updateFailed: 'Update failed',
  toolUpdateFailed: 'Tool update failed',
  configSaved: 'Configuration saved',
  configSaveFailed: 'Failed to save configuration',
  invalidToolType: 'Invalid tool type',
};

export interface ToolStoreAction {
  useFetchToolStore: () => SWRResponse<ToolStoreItem[]>;
  installTool: (id: string) => Promise<void>;
  uninstallTool: (id: string) => Promise<void>;
  updateTool: (id: string, version: string) => Promise<void>;
  saveToolConfig: (id: string, config: Record<string, unknown>) => Promise<void>;
  enableTool: (id: string) => Promise<void>;
  disableTool: (id: string) => Promise<void>;
  getToolConfig: (id: string) => Promise<Record<string, unknown> | null>;
}

export const createToolStoreSlice: StateCreator<
  ToolStore,
  [['zustand/devtools', never]],
  [],
  ToolStoreAction
> = () => ({
  installTool: async (id) => {
    const messageKey = 'installTool';
    
    notification.open({
      description: translate.installing,
      key: messageKey,
      message: translate.toolInstalling,
      type: 'info',
    });

    try {
      await toolService.installTool(id);
      await mutate(FETCH_TOOL_STORE_KEY);

      notification.open({
        description: translate.installSuccess,
        key: messageKey,
        message: translate.toolInstallSuccess,
        type: 'success',
      });
    } catch (error) {
      notification.open({
        description: translate.installFailed,
        key: messageKey,
        message: translate.toolInstallFailed,
        type: 'error',
      });
    }
  },

  uninstallTool: async (id) => {
    const messageKey = 'uninstallTool';
    
    notification.open({
      description: translate.uninstalling,
      key: messageKey,
      message: translate.toolUninstalling,
      type: 'info',
    });

    try {
      await toolService.uninstallTool(id);
      await mutate(FETCH_TOOL_STORE_KEY);

      notification.open({
        description: translate.uninstallSuccess,
        key: messageKey,
        message: translate.toolUninstallSuccess,
        type: 'success',
      });
    } catch (error) {
      notification.open({
        description: translate.uninstallFailed,
        key: messageKey,
        message: translate.toolUninstallFailed,
        type: 'error',
      });
    }
  },

  updateTool: async (id, version) => {
    const messageKey = 'updateTool';
    
    notification.open({
      description: translate.updating,
      key: messageKey,
      message: translate.toolUpdating,
      type: 'info',
    });

    try {
      await toolService.updateTool(id, version);
      await mutate(FETCH_TOOL_STORE_KEY);

      notification.open({
        description: translate.updateSuccess,
        key: messageKey,
        message: translate.toolUpdateSuccess,
        type: 'success',
      });
    } catch (error) {
      notification.open({
        description: translate.updateFailed,
        key: messageKey,
        message: translate.toolUpdateFailed,
        type: 'error',
      });
    }
  },

  saveToolConfig: async (id, config) => {
    try {
      await toolService.saveToolConfig(id, config);
      notification.success({
        message: translate.configSaved,
      });
    } catch (error) {
      notification.error({
        message: translate.configSaveFailed,
      });
    }
  },

  enableTool: async (id) => {
    try {
      await toolService.enableTool(id);
      await mutate(FETCH_TOOL_STORE_KEY);
    } catch (error) {
      notification.error({
        message: translate.toolUpdateFailed,
      });
    }
  },

  disableTool: async (id) => {
    try {
      await toolService.disableTool(id);
      await mutate(FETCH_TOOL_STORE_KEY);
    } catch (error) {
      notification.error({
        message: translate.toolUpdateFailed,
      });
    }
  },

  getToolConfig: async (id) => {
    try {
      return await toolService.getToolConfig(id);
    } catch {
      return null;
    }
  },

  useFetchToolStore: () =>
    useClientDataSWR<ToolStoreItem[]>(
      FETCH_TOOL_STORE_KEY,
      async () => {
        try {
          return await toolService.getToolStoreList();
        } catch {
          return DEFAULT_TOOL_STORE_DATA;
        }
      },
      {
        fallbackData: DEFAULT_TOOL_STORE_DATA,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (retryCount > 3) return;

          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      },
    ),
});
