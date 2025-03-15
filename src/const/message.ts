// Special flags for message handling
export const MESSAGE_CANCEL_FLAG = '[CANCELLED]';
export const MESSAGE_ERROR_FLAG = '[ERROR]';
export const MESSAGE_PENDING_FLAG = '[PENDING]';
export const MESSAGE_LOADING_FLAG = '[LOADING]';

// Additional flags that were missing
export const LOADING_FLAT = 'loading_flat';
export const MESSAGE_CANCEL_FLAT = 'message_cancel_flat';
export const THREAD_DRAFT_ID = 'thread_draft_id';

// Default message settings
export const DEFAULT_MESSAGE_BATCH_SIZE = 20;
export const DEFAULT_MESSAGE_RETRY_TIMEOUT = 3000; // 3 seconds
export const MAX_MESSAGE_LENGTH = 4000;

// Message role types
export const SYSTEM_ROLE = 'system';
export const USER_ROLE = 'user';
export const ASSISTANT_ROLE = 'assistant';

// Message status
export const MESSAGE_STATUS = {
  PENDING: 'pending',
  SENDING: 'sending',
  SENT: 'sent',
  ERROR: 'error',
} as const;