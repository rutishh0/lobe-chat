export type SyncStatusType = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncStatus {
  lastSyncTime: number | null;
  status: SyncStatusType;
  error?: string;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // in milliseconds
  retryOnError: boolean;
  maxRetries?: number;
}

export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  autoSync: true,
  syncInterval: 300000, // 5 minutes
  retryOnError: true,
  maxRetries: 3,
};
