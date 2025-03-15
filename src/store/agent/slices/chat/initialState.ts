import type { ChatMessage } from '@/types/message';

export interface AgentState {
  activeId?: string;
  messages: ChatMessage[];
  isLoading: boolean;
  error?: Error;
}

export const initialState: AgentState = {
  activeId: undefined,
  messages: [],
  isLoading: false,
};
