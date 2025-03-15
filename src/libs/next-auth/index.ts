import NextAuth from 'next-auth';

import { getServerDBConfig } from '@/config/db';
import { serverDB } from '@/database/server';

import { LobeNextAuthDbAdapter } from './adapter';
import config from './auth.config';

const { NEXT_PUBLIC_ENABLED_SERVER_SERVICE } = getServerDBConfig();

// Ensure config.providers is always an array
const safeConfig = {
  ...config,
  providers: Array.isArray(config.providers) ? config.providers : [],
};

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
  // Add defensive code for any callbacks that might use filter()
  callbacks: {
    ...safeConfig.callbacks,
    async jwt(params) {
      try {
        return await safeConfig.callbacks?.jwt?.(params) || params.token;
      } catch (error) {
        console.error('[NextAuth] Error in jwt callback:', error);
        return params.token;
      }
    },
    async session(params) {
      try {
        return await safeConfig.callbacks?.session?.(params) || params.session;
      } catch (error) {
        console.error('[NextAuth] Error in session callback:', error);
        return params.session;
      }
    },
  },
});