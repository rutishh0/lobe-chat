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

// Fix the interface name (remove 'Schame')
export interface NextAuthAccount {
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

// Add schema as a constant value (this is what's being imported)
export const NextAuthAccountSchema = {
  id: String,
  userId: String,
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String
};

export interface UserGuide {
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

// Add schema as a constant value (this is what's being imported)
export const UserGuideSchema = {
  id: String,
  userId: String,
  hasShownWelcomeScreen: Boolean,
  hasShownAgentHelp: Boolean,
  hasShownSessionHelp: Boolean,
  hasShownChatHelp: Boolean,
  hasShownImportAgentHelp: Boolean,
  createdAt: Date,
  updatedAt: Date
};