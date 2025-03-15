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

// Keep the interface for TypeScript type checking
export interface MessageToolCall {
  id: string;
  type: string;
  name?: string;
  args?: Record<string, any>;
  content?: string;
  status?: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
  result?: any;
}

// Add a schema export that can be imported as a value
// This is what the code is trying to import
export const MessageToolCallSchema = {
  id: String,
  type: String,
  name: String,
  args: Object,
  content: String,
  status: String,
  error: String,
  result: Object,
  // Add validation methods if needed
  validate: (obj: any): obj is MessageToolCall => {
    return typeof obj === 'object' && obj !== null 
      && typeof obj.id === 'string' 
      && typeof obj.type === 'string';
  }
};

// Message constants
export const LOADING_FLAT = 'loading_flat';
export const MESSAGE_CANCEL_FLAT = 'message_cancel_flat';
export const THREAD_DRAFT_ID = 'thread_draft_id';