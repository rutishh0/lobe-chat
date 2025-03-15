import { NextResponse } from 'next/server';

import { authEnv } from '@/config/auth';
import { pino } from '@/libs/logger';
import { NextAuthUserService } from '@/server/services/nextAuthUser';

import { validateRequest } from './validateRequest';

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const payload = await validateRequest(req, authEnv.CASDOOR_WEBHOOK_SECRET);

    if (!payload) {
      return NextResponse.json(
        { error: 'webhook verification failed or payload was malformed' },
        { status: 400 },
      );
    }

    // Make sure payload has the expected structure
    const { action, object } = payload;
    
    if (!action || !object || typeof object !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 },
      );
    }

    const nextAuthUserService = new NextAuthUserService();
    switch (action) {
      case 'update-user': {
        // Ensure object is properly structured before passing it
        if (!object.id) {
          return NextResponse.json(
            { error: 'Invalid user object: missing ID' },
            { status: 400 },
          );
        }

        return nextAuthUserService.safeUpdateUser(
          {
            provider: 'casdoor',
            providerAccountId: object.id,
          },
          {
            avatar: object.avatar || null,
            email: object.email || null,
            fullName: object.displayName || null,
          },
        );
      }

      default: {
        pino.warn(
          `${req.url} received event type "${action}", but no handler is defined for this type`,
        );
        return NextResponse.json({ error: `unrecognised payload type: ${action}` }, { status: 400 });
      }
    }
  } catch (error) {
    // Add error logging
    pino.error(`Error in casdoor webhook: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};