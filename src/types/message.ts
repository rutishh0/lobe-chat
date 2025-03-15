export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sessionId: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}

export interface MessageDispatch {
  meta?: Record<string, unknown>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface MessageList {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
}

// Missing export that's causing build errors
export interface MessageToolCallSchema {
  id: string;
  type: string;
  name?: string;
  args?: Record<string, any>;
  content?: string;
  status?: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
  result?: any;
}

// Message constants that were missing
export const LOADING_FLAT = 'loading_flat';
export const MESSAGE_CANCEL_FLAT = 'message_cancel_flat';
export const THREAD_DRAFT_ID = 'thread_draft_id';