import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // TODO: Implement proper auth check with Supabase
  // For now, allow all requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
