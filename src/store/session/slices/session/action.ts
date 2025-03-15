import { produce } from 'immer';
import type { StateCreator } from 'zustand/vanilla';

import { MESSAGE_CANCEL_FLAG } from '@/const/message';
import { useClientDataSWR, mutate } from '@/libs/swr';
import { sessionService } from '@/services/session';
import type { SessionStore } from '@/store/session';
import type { Session, SessionGroup, SessionListResponse } from '@/types/session';

export interface SessionAction {
  activeId: string | undefined;
  setActiveId: (id: string) => void;
  clearActiveId: () => void;
  useFetchSessions: () => {
    data: SessionListResponse;
    isLoading: boolean;
    mutate: () => Promise<void>;
  };
  createSession: (session: Partial<Session>) => Promise<Session>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  createSessionGroup: (group: Partial<SessionGroup>) => Promise<SessionGroup>;
  updateSessionGroup: (id: string, updates: Partial<SessionGroup>) => Promise<void>;
  removeSessionGroup: (id: string) => Promise<void>;
}

const FETCH_SESSIONS_KEY = 'fetchSessions';

export const createSessionSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  SessionAction
> = (set, get) => ({
  activeId: undefined,

  setActiveId: (id) => {
    set({ activeId: id }, false, 'setActiveId');
  },

  clearActiveId: () => {
    set({ activeId: undefined }, false, 'clearActiveId');
  },

  useFetchSessions: () => {
    const { data, isLoading } = useClientDataSWR(
      FETCH_SESSIONS_KEY,
      async () => {
        try {
          return await sessionService.getSessions();
        } catch {
          return { sessions: [], groups: [] };
        }
      },
      {
        revalidateOnFocus: false,
      },
    );

    return {
      data: data || { sessions: [], groups: [] },
      isLoading,
      mutate: async () => {
        await mutate(FETCH_SESSIONS_KEY);
      },
    };
  },

  createSession: async (session) => {
    const newSession = await sessionService.createSession(session);
    await mutate(FETCH_SESSIONS_KEY);
    return newSession;
  },

  updateSession: async (id, updates) => {
    await sessionService.updateSession(id, updates);
    await mutate(FETCH_SESSIONS_KEY);
  },

  removeSession: async (id) => {
    await sessionService.removeSession(id);
    await mutate(FETCH_SESSIONS_KEY);
  },

  createSessionGroup: async (group) => {
    const newGroup = await sessionService.createSessionGroup(group);
    await mutate(FETCH_SESSIONS_KEY);
    return newGroup;
  },

  updateSessionGroup: async (id, updates) => {
    await sessionService.updateSessionGroup(id, updates);
    await mutate(FETCH_SESSIONS_KEY);
  },

  removeSessionGroup: async (id) => {
    await sessionService.removeSessionGroup(id);
    await mutate(FETCH_SESSIONS_KEY);
  },
});
