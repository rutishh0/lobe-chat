// This route will be used as a fallback for all tRPC routes
// Add this to make it a static route during build
export const dynamic = 'force-static';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { pino } from '@/libs/logger';
import { createContext } from '@/server/context';
import { lambdaRouter } from '@/server/routers/lambda';

const handler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      createContext: () => createContext(req),
      endpoint: '/trpc/lambda',
      onError: ({ error, path }) => {
        pino.info(`Error in tRPC handler (lambda) on path: ${path}`);
        console.error(error);
      },
      req,
      router: lambdaRouter,
    });
  } catch (error) {
    console.error('Unexpected error in tRPC lambda handler:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Internal Server Error', 
        error: String(error) 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export { handler as GET, handler as POST };