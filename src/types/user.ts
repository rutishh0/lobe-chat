export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
  fontSize?: number;
  fontFamily?: string;
  autoSave?: boolean;
  notifications?: boolean;
}

export interface UserPreference {
  themeMode: ThemeMode;  // Changed from 'theme' to 'themeMode' to match the interface
  language: string;
  telemetry: boolean | null;
  settings: UserSettings;
}

// Export the constant separately
export const DEFAULT_USER_SETTINGS: UserSettings = {
  fontSize: 14,
  fontFamily: 'system-ui',
  autoSave: true,
  notifications: true,
};

export const DEFAULT_USER_PREFERENCE: UserPreference = {
  themeMode: 'light',
  language: 'en-US',
  telemetry: false,
  settings: DEFAULT_USER_SETTINGS,
};

// Added missing schema as interfaces instead of types
export interface NextAuthAccountSchame {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface UserGuideSchema {
  id: string;
  userId: string;
  hasShownWelcomeScreen?: boolean;
  hasShownAgentHelp?: boolean;
  hasShownSessionHelp?: boolean;
  hasShownChatHelp?: boolean;
  hasShownImportAgentHelp?: boolean;
  createdAt: Date;
  updatedAt: Date;
}