import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'tRPC temporarily unavailable during deployment',
    status: 'error'
  }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({
    message: 'tRPC temporarily unavailable during deployment',
    status: 'error'
  }, { status: 503 });
}