import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pino } from '@/libs/logger';
import { createAsyncRouteContext } from '@/server/asyncContext';
import { asyncRouter } from '@/server/routers/async';

// Force Node.js runtime for this route
export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

// Wrap the handler in a try/catch to prevent build failures
const safeHandler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      /**
       * @link https://trpc.io/docs/v11/context
       */
      createContext: () => createAsyncRouteContext(req),

      endpoint: '/trpc/async',

      onError: ({ error, path, type }) => {
        pino.info(`Error in tRPC handler (async) on path: ${path}, type: ${type}`);
        console.error(error);
      },

      req,
      router: asyncRouter,
    });
  } catch (error) {
    console.error('Error in tRPC async handler:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
};

export { safeHandler as GET, safeHandler as POST };