import isEqual from 'fast-deep-equal';
import { produce } from 'immer';
import { DeepPartial } from 'utility-types';
import { StateCreator } from 'zustand/vanilla';

import { MESSAGE_CANCEL_FLAG } from '@/const/message';
import { INBOX_SESSION_ID } from '@/const/session';
import { useClientDataSWR, mutate } from '@/libs/swr';
import { agentService } from '@/services/agent';
import { sessionService } from '@/services/session';
import { AgentState } from '@/store/agent/slices/chat/initialState';
import type { ChatMessage, MessageDispatch } from '@/types/message';
import type { Session } from '@/types/session';

export interface ChatAction {
  activeId: string | undefined;
  setActiveId: (id: string) => void;
  clearActiveId: () => void;
  useFetchMessages: (sessionId: string) => {
    data: ChatMessage[];
    isLoading: boolean;
    mutate: () => Promise<void>;
  };
  sendMessage: (message: string, options?: MessageDispatch) => Promise<void>;
  clearMessage: () => void;
  updateMessage: (message: DeepPartial<ChatMessage>) => void;
  refreshMessages: () => Promise<void>;
}

const FETCH_MESSAGES_KEY = (id: string) => `fetchMessages_${id}`;

export const createChatSlice: StateCreator<
  AgentState,
  [['zustand/devtools', never]],
  [],
  ChatAction
> = (set, get) => ({
  activeId: undefined,

  setActiveId: (id) => {
    set({ activeId: id }, false, 'setActiveId');
  },

  clearActiveId: () => {
    set({ activeId: undefined }, false, 'clearActiveId');
  },

  useFetchMessages: (sessionId) => {
    const key = FETCH_MESSAGES_KEY(sessionId);
    const { data, isLoading } = useClientDataSWR(
      key,
      async () => {
        try {
          return await sessionService.getMessages(sessionId);
        } catch {
          return [];
        }
      },
      {
        revalidateOnFocus: false,
      },
    );

    return {
      data: data || [],
      isLoading,
      mutate: async () => {
        await mutate(key);
      },
    };
  },

  sendMessage: async (content, options = {}) => {
    const { activeId } = get();
    if (!activeId) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      sessionId: activeId,
      timestamp: Date.now(),
      ...options,
    };

    set(
      produce((state: AgentState) => {
        if (!state.messages) state.messages = [];
        state.messages.push(message);
      }),
      false,
      'sendMessage',
    );

    await mutate(FETCH_MESSAGES_KEY(activeId));
  },

  clearMessage: () => {
    set({ messages: [] }, false, 'clearMessage');
  },

  updateMessage: (message) => {
    set(
      produce((state: AgentState) => {
        const index = state.messages?.findIndex((m) => m.id === message.id);
        if (index === undefined || index === -1) return;

        const original = state.messages?.[index];
        if (!original) return;

        state.messages[index] = { ...original, ...message };

        if (message.content?.includes(MESSAGE_CANCEL_FLAG)) {
          state.messages.splice(index, 1);
        }
      }),
      false,
      'updateMessage',
    );
  },

  refreshMessages: async () => {
    const { activeId } = get();
    if (!activeId) return;

    await mutate(FETCH_MESSAGES_KEY(activeId));
  },
});
