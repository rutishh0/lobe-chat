import NextAuth from 'next-auth';

import authConfig from './auth.config';

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
const safeConfig = createSafeConfig(authConfig);

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
export default NextAuth(safeConfig);