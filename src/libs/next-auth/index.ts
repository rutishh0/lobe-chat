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
  const safeConfig = {
    ...inputConfig,
    providers: ensureArray(inputConfig.providers),
    callbacks: {
      // Wrap callbacks to handle errors
      async jwt(params) {
        try {
          const result = await inputConfig?.callbacks?.jwt?.(params);
          return result || params.token || {};
        } catch (error) {
          console.error('[NextAuth] Error in jwt callback:', error);
          return params.token || {};
        }
      },
      async session(params) {
        try {
          const result = await inputConfig?.callbacks?.session?.(params);
          return result || params.session || {};
        } catch (error) {
          console.error('[NextAuth] Error in session callback:', error);
          return params.session || {};
        }
      },
      // Add other callbacks as needed with similar error handling
    },
  };
  
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
  ...safeConfig,
  adapter: NEXT_PUBLIC_ENABLED_SERVER_SERVICE ? LobeNextAuthDbAdapter(serverDB) : undefined,
  session: {
    strategy: 'jwt',
  },
});