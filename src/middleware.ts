import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.match('/')) {
    return NextResponse.rewrite(new URL('/coming-soon', request.url));
  } else {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/bionix/competition/registration'],
};
