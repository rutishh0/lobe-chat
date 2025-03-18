import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Explicitly set the runtime to 'edge'
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}