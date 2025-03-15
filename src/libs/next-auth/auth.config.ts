import type { NextAuthConfig } from 'next-auth';

import { authEnv } from '@/config/auth';

import { ssoProviders } from './sso-providers';

/**
 * Ensures the given value is always an array
 */
const ensureArray = (value) => {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Initialize SSO providers in a safe way
 */
export const initSSOProviders = () => {
  try {
    // Return empty array if NextAuth is not enabled
    if (!authEnv.NEXT_PUBLIC_ENABLE_NEXT_AUTH) return [];
    
    // Return empty array if providers config is not a valid string
    if (typeof authEnv.NEXT_AUTH_SSO_PROVIDERS !== 'string' || !authEnv.NEXT_AUTH_SSO_PROVIDERS) {
      console.warn('[NextAuth] NEXT_AUTH_SSO_PROVIDERS is not properly configured');
      return [];
    }
    
    // Safe split - return empty array if split fails
    let providerNames = [];
    try {
      providerNames = authEnv.NEXT_AUTH_SSO_PROVIDERS.split(/[,，]/);
    } catch (e) {
      console.warn('[NextAuth] Failed to split providers list:', e);
      return [];
    }
    
    // Map provider names to actual provider configurations
    const providers = providerNames
      .map((provider) => {
        try {
          const trimmedProvider = provider.trim();
          const validProvider = ssoProviders.find((item) => item.id === trimmedProvider);
          
          if (validProvider) return validProvider.provider;
          
          // Log warning but don't throw error
          console.warn(`[NextAuth] Provider ${trimmedProvider} is not supported`);
          return null;
        } catch (e) {
          console.warn(`[NextAuth] Error processing provider ${provider}:`, e);
          return null;
        }
      })
      .filter(Boolean); // Filter out null values
    
    return ensureArray(providers);
  } catch (error) {
    console.error('[NextAuth] Error initializing providers:', error);
    return [];
  }
};

// Configure safe callbacks that handle null/undefined values
const safeCallbacks = {
  async jwt({ token, user }) {
    try {
      // Defensive approach - ensure we always return a valid token
      if (!token) token = { };
      
      // ref: https://authjs.dev/guides/extending-the-session#with-jwt
      if (user?.id) {
        token.userId = user.id;
      }
      return token;
    } catch (error) {
      console.error('[NextAuth] Error in jwt callback:', error);
      return token || { };
    }
  },
  
  async session({ session, token, user }) {
    try {
      // Defensive - ensure session and session.user exist
      if (!session) session = { };
      if (!session.user) session.user = { };
      
      // ref: https://authjs.dev/guides/extending-the-session#with-database
      if (user?.id) {
        session.user.id = user.id;
      } else if (token?.userId) {
        session.user.id = token.userId as string;
      }
      
      return session;
    } catch (error) {
      console.error('[NextAuth] Error in session callback:', error);
      return session || { };
    }
  },
};

// Notice this is only an object, not a full Auth.js instance
export default {
  callbacks: safeCallbacks,
  debug: authEnv.NEXT_AUTH_DEBUG,
  pages: {
    error: '/next-auth/error',
    signIn: '/next-auth/signin',
  },
  // Always ensure providers is an array
  providers: ensureArray(initSSOProviders()),
  secret: authEnv.NEXT_AUTH_SECRET,
  trustHost: process.env?.AUTH_TRUST_HOST ? process.env.AUTH_TRUST_HOST === 'true' : true,
} satisfies NextAuthConfig;