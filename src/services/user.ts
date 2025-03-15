import { DeepPartial } from 'utility-types';
import type { GlobalServerConfig } from '../types/serverConfig';
import { DEFAULT_USER_PREFERENCE, type UserPreference } from '../types/user';

class UserService {
  async checkUserExist(): Promise<boolean> {
    // In a real implementation, this would check if the user exists
    return true;
  }

  async getUserConfig(): Promise<GlobalServerConfig> {
    // In a real implementation, this would fetch user config from server
    return {
      version: '1.0.0',
      settings: {},
      aiProvider: {
        provider: 'openai',
      },
      telemetry: {
        enabled: false,
      },
    };
  }

  async getUserPreference(): Promise<UserPreference> {
    // In a real implementation, this would fetch user preferences from server
    return DEFAULT_USER_PREFERENCE;
  }

  async updateUserPreference(value: DeepPartial<UserPreference>): Promise<void> {
    // In a real implementation, this would update user preferences on server
  }
}

export const userService = new UserService();
