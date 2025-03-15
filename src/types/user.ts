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
