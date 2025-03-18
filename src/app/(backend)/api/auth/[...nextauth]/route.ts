import NextAuthNode from '@/libs/next-auth';

// Skip during build time
const skipBuildProcessing = () => {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'content-type': 'application/json' },
    });
  }
  return null;
};

export const GET = async (req: Request) => {
  const skipResponse = skipBuildProcessing();
  if (skipResponse) return skipResponse;
  
  return NextAuthNode.handlers.GET(req);
};

export const POST = async (req: Request) => {
  const skipResponse = skipBuildProcessing();
  if (skipResponse) return skipResponse;
  
  return NextAuthNode.handlers.POST(req);
};