import NextAuth from 'next-auth';

import { getServerDBConfig } from '@/config/db';
import { serverDB } from '@/database/server';

import { LobeNextAuthDbAdapter } from './adapter';
import config from './auth.config';

const { NEXT_PUBLIC_ENABLED_SERVER_SERVICE } = getServerDBConfig();

// Helper function to ensure arrays
const ensureArray = (value) => {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

// Make a completely safe config where we ensure all properties have valid default values
const createSafeConfig = (inputConfig) => {
  // Create a completely safe base config
  const safeConfig = {
    providers: [],
    callbacks: {
      async jwt(params) {
        try {
          if (inputConfig?.callbacks?.jwt) {
            const result = await inputConfig.callbacks.jwt(params);
            if (result) return result;
          }
          return params.token || {};
        } catch (error) {
          console.error('[NextAuth] Error in jwt callback:', error);
          return params.token || {};
        }
      },
      async session(params) {
        try {
          if (inputConfig?.callbacks?.session) {
            const result = await inputConfig.callbacks.session(params);
            if (result) return result;
          }
          return params.session || {};
        } catch (error) {
          console.error('[NextAuth] Error in session callback:', error);
          return params.session || {};
        }
      },
      // Add other callbacks as needed with similar error handling
    },
  };
  
  // Only then apply the input config with extreme caution
  if (inputConfig && typeof inputConfig === 'object') {
    if (inputConfig.providers) safeConfig.providers = ensureArray(inputConfig.providers);
    // Copy other safe properties
    if (inputConfig.pages) safeConfig.pages = inputConfig.pages;
    if (inputConfig.secret) safeConfig.secret = inputConfig.secret;
    if (inputConfig.debug) safeConfig.debug = inputConfig.debug;
    if (inputConfig.trustHost) safeConfig.trustHost = inputConfig.trustHost;
  }
  
  return safeConfig;
};

// Create a completely safe version of the config
const safeConfig = createSafeConfig(config);

/**
 * NextAuth initialization with Database adapter
 *
 * @example
 * ```ts
 * import NextAuthNode from '@/libs/next-auth';
 * const { handlers } = NextAuthNode;
 * ```
 *
 * @note
 * If you meet the edge runtime compatible problem,
 * you can import from `@/libs/next-auth/edge` which is not initial with the database adapter.
 *
 * The difference and usage of the two different NextAuth modules is can be
 * ref to: https://github.com/lobehub/lobe-chat/pull/2935
 */
export default NextAuth({
  // Apply the session first
  session: {
    strategy: 'jwt',
  },
  // Apply the adapter
  adapter: NEXT_PUBLIC_ENABLED_SERVER_SERVICE ? LobeNextAuthDbAdapter(serverDB) : undefined,
  // Spread safe config last to ensure it has priority
  ...safeConfig,
});