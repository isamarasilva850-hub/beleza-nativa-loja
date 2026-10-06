import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Disabled temporarily to debug page load issues
  return NextResponse.next();
}

export const config = {
  matcher: [],  // Disabled - no matchers
};
