import { NextResponse } from 'next/server';

// For edge runtime
export const runtime = 'edge';

// Check if we're in build phase - do this before any imports to prevent errors
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

// Only import dependencies if not in build phase
let authEnv, isServerMode, pino, UserService, validateRequest;

if (!isBuildPhase) {
  // Dynamic imports to avoid build-time evaluation
  authEnv = require('@/config/auth').authEnv;
  isServerMode = require('@/const/version').isServerMode;
  pino = require('@/libs/logger').pino;
  UserService = require('@/server/services/user').UserService;
  validateRequest = require('./validateRequest').validateRequest;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  // Skip processing during build time
  if (isBuildPhase) {
    return NextResponse.json({ status: 'skipped during build' });
  }

  try {
    // Validate environment variables at runtime
    if (authEnv.NEXT_PUBLIC_ENABLE_CLERK_AUTH && isServerMode && !authEnv.CLERK_WEBHOOK_SECRET) {
      throw new Error('`CLERK_WEBHOOK_SECRET` environment variable is missing');
    }

    const payload = await validateRequest(req, authEnv.CLERK_WEBHOOK_SECRET!);

    if (!payload) {
      return NextResponse.json(
        { error: 'webhook verification failed or payload was malformed' },
        { status: 400 },
      );
    }

    const { type, data } = payload;

    pino.trace(`clerk webhook payload: ${{ data, type }}`);

    const userService = new UserService();
    switch (type) {
      case 'user.created': {
        pino.info('creating user due to clerk webhook');
        const result = await userService.createUser(data.id, data);

        return NextResponse.json(result, { status: 200 });
      }

      case 'user.deleted': {
        if (!data.id) {
          pino.warn('clerk sent a delete user request, but no user ID was included in the payload');
          return NextResponse.json({ message: 'ok' }, { status: 200 });
        }

        pino.info('delete user due to clerk webhook');

        await userService.deleteUser(data.id);

        return NextResponse.json({ message: 'user deleted' }, { status: 200 });
      }

      case 'user.updated': {
        const result = await userService.updateUser(data.id, data);

        return NextResponse.json(result, { status: 200 });
      }

      default: {
        pino.warn(
          `${req.url} received event type "${type}", but no handler is defined for this type`,
        );
        return NextResponse.json({ error: `unrecognised payload type: ${type}` }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Error in clerk webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

// Also add a GET handler for completeness
export const GET = () => {
  if (isBuildPhase) {
    return NextResponse.json({ status: 'skipped during build' });
  }
  
  return NextResponse.json({ 
    status: 'active',
    message: 'Clerk webhook endpoint is active' 
  });
};