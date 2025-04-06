// This route will be used as a fallback for all tRPC routes
// Mark this as a dynamic route to properly handle API requests
export const dynamic = 'force-dynamic';

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
        console.error('tRPC error details:', error);
        
        // If there's a cause, log that as well
        if (error.cause) {
          console.error('Error cause:', error.cause);
        }
      },
      req,
      router: lambdaRouter,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Unexpected error in tRPC lambda handler:', error);
    
    // Convert error to a readable format
    let errorMessage = 'Internal Server Error';
    let errorDetails = String(error);
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || String(error);
    }
    
    return new Response(
      JSON.stringify({ 
        message: errorMessage, 
        error: errorDetails,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export { handler as GET, handler as POST };