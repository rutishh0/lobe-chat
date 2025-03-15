import type { NextAuthConfig } from 'next-auth';

import { authEnv } from '@/config/auth';

import { ssoProviders } from './sso-providers';

// Helper function to ensure we always get an array
const ensureArray = (possibleArray) => {
  if (!possibleArray) return [];
  return Array.isArray(possibleArray) ? possibleArray : [possibleArray];
};

export const initSSOProviders = () => {
  if (!authEnv.NEXT_PUBLIC_ENABLE_NEXT_AUTH) return [];
  
  // Defensive check to ensure NEXT_AUTH_SSO_PROVIDERS is a string
  if (typeof authEnv.NEXT_AUTH_SSO_PROVIDERS !== 'string' || !authEnv.NEXT_AUTH_SSO_PROVIDERS) {
    console.warn('[NextAuth] NEXT_AUTH_SSO_PROVIDERS is not properly configured');
    return [];
  }
  
  try {
    const providersList = authEnv.NEXT_AUTH_SSO_PROVIDERS.split(/[,，]/)
      .map((provider) => {
        const trimmedProvider = provider.trim();
        const validProvider = ssoProviders.find((item) => item.id === trimmedProvider);
        
        if (validProvider) return validProvider.provider;
        
        console.warn(`[NextAuth] provider ${trimmedProvider} is not supported`);
        return null;
      })
      .filter(Boolean); // Filter out null values
    
    return ensureArray(providersList); // Ensure we always return an array
  } catch (error) {
    console.error('[NextAuth] Error initializing providers:', error);
    return [];
  }
};

// Notice this is only an object, not a full Auth.js instance
export default {
  callbacks: {
    // Note: Data processing order of callback: authorize --> jwt --> session
    async jwt({ token, user }) {
      // ref: https://authjs.dev/guides/extending-the-session#with-jwt
      if (user?.id) {
        token.userId = user?.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        // ref: https://authjs.dev/guides/extending-the-session#with-database
        if (user) {
          session.user.id = user.id;
        } else if (token) {
          session.user.id = (token.userId ?? session.user.id) as string;
        }
      }
      return session || {};
    },
  },
  debug: authEnv.NEXT_AUTH_DEBUG,
  pages: {
    error: '/next-auth/error',
    signIn: '/next-auth/signin',
  },
  providers: ensureArray(initSSOProviders()), // Ensure we always have an array
  secret: authEnv.NEXT_AUTH_SECRET,
  trustHost: process.env?.AUTH_TRUST_HOST ? process.env.AUTH_TRUST_HOST === 'true' : true,
} satisfies NextAuthConfig;