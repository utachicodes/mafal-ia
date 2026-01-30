import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes require ADMIN role
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (token.role !== 'ADMIN') {
      // Authenticated but not admin - forbidden
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
  }

  // Restaurant owner dashboard routes
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    // Restaurant owners can only access their dashboard
    if (token.role !== 'RESTAURANT_OWNER' && token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
