// app/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public routes
  const isPublicRoute = ['/auth/login', '/auth/signup'].includes(path);
  
  // Get the auth token from cookie
  const authToken = request.cookies.get('auth-token')?.value || '';

  // If the user is not authenticated and trying to access a protected route,
  // redirect to the login page
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If the user is authenticated and trying to access login,
  // redirect to dashboard
  if (authToken && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

