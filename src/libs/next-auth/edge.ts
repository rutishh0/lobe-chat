import NextAuth from 'next-auth';

import authConfig from './auth.config';

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
export default NextAuth({
  // Spread safe config first as a base
  ...safeConfig,
  // Apply session strategy last to ensure it overrides
  session: {
    strategy: 'jwt',
  }
});