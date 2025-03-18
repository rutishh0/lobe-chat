import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Set maxDuration without runtime specification
export const maxDuration = 60;

// Create a minimal handler that will pass the build
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}