export interface Session {
  id: string;
  name: string;
  description?: string;
  type?: string;
  groupId?: string;
  meta?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface SessionGroup {
  id: string;
  name: string;
  description?: string;
  sort?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SessionListResponse {
  sessions: Session[];
  groups: SessionGroup[];
}

export interface SessionStore {
  activeId?: string;
  sessions: Session[];
  groups: SessionGroup[];
}

// Added missing exports
export type SessionDefaultGroup = 'default' | 'archived' | 'starred';
export type LobeSessionType = 'chat' | 'agent' | 'image';

export const INBOX_SESSION_ID = 'inbox';