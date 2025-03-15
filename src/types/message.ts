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
