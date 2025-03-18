// Check if we're in build mode first, before any imports
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

// Only import NextAuth if we're not in build phase
// This prevents the import from running during build
let NextAuthNode: any;
if (!isBuildPhase) {
  NextAuthNode = require('@/libs/next-auth').default;
}

// Helper function for build phase
const buildPhaseResponse = () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'content-type': 'application/json' },
  });
};

// Completely separated handlers that don't access NextAuth during build
export const GET = async (req: Request) => {
  if (isBuildPhase) {
    return buildPhaseResponse();
  }
  
  return NextAuthNode.handlers.GET(req);
};

export const POST = async (req: Request) => {
  if (isBuildPhase) {
    return buildPhaseResponse();
  }
  
  return NextAuthNode.handlers.POST(req);
};