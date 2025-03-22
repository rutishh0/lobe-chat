// Skip this route in production to avoid edge runtime errors
export const dynamic = 'force-static';
export const generateStaticParams = () => [];

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { pino } from '@/libs/logger';
import { createContext } from '@/server/context';
import { edgeRouter } from '@/server/routers/edge';

export const runtime = 'edge';

// Wrap the handler in a try/catch to better handle potential errors
const handler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      /**
       * @link https://trpc.io/docs/v11/context
       */
      createContext: () => createContext(req),

      endpoint: '/trpc/edge',

      onError: ({ error, path }) => {
        pino.info(`Error in tRPC handler (edge) on path: ${path}`);
        console.error(error);
      },

      req,
      router: edgeRouter,
    });
  } catch (error) {
    console.error('Unexpected error in tRPC edge handler:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export { handler as GET, handler as POST };