import { NextResponse } from 'next/server';

import { authEnv } from '@/config/auth';
import { pino } from '@/libs/logger';
import { NextAuthUserService } from '@/server/services/nextAuthUser';

import { validateRequest } from './validateRequest';

// Explicitly export the config to ensure it uses Node.js runtime
export const config = {
  runtime: 'nodejs',
};

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    // Validate the request
    const payload = await validateRequest(req, authEnv.LOGTO_WEBHOOK_SIGNING_KEY || '');
    
    if (!payload) {
      return NextResponse.json(
        { error: 'webhook verification failed or payload was malformed' },
        { status: 400 },
      );
    }

    // Safely extract event and data
    const event = payload.event || '';
    const data = payload.data || {};
    
    // Use separate logging statements to avoid object interpolation issues
    pino.trace('logto webhook event received:', event);
    
    // Only attempt to use the user service if we have a valid event and data
    if (event === 'User.Data.Updated' && data && typeof data === 'object' && data.id) {
      const nextAuthUserService = new NextAuthUserService();
      
      return nextAuthUserService.safeUpdateUser(
        {
          provider: 'logto',
          providerAccountId: data.id,
        },
        {
          avatar: data.avatar || null,
          email: data.primaryEmail || null,
          fullName: data.name || null,
        },
      );
    }
    
    // Handle unrecognized events
    pino.warn(`Received unhandled event type: ${event}`);
    return NextResponse.json({ status: 'noop', event }, { status: 200 });
  } catch (error) {
    // Safely log errors
    console.error('Error in Logto webhook handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};