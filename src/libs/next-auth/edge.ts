import NextAuth from 'next-auth';

import authConfig from './auth.config';

// Ensure config.providers is always an array
const safeConfig = {
  ...authConfig,
  providers: Array.isArray(authConfig.providers) ? authConfig.providers : [],
};

/**
 * NextAuth initialization without Database adapter
 *
 * @example
 * ```ts
 * import NextAuthEdge from '@/libs/next-auth/edge';
 * const { auth } = NextAuthEdge;
 * ```
 *
 * @note
 * We currently use `jwt` strategy for session management.
 * So you don't need to import `signIn` or `signOut` from
 * this module, just import from `next-auth` directly.
 *
 * Inside react component
 * @example
 * ```ts
 * import { signOut } from 'next-auth/react';
 * signOut();
 * ```
 */
export default NextAuth({
  ...safeConfig,
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