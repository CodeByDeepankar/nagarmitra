import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add middleware logic here if needed
  // For now, this is a placeholder for future auth middleware
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/report/:path*', '/issues/:path*'],
};
