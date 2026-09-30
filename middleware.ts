import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Switch to 'true' if maintenance is ever needed in the future
const IS_MAINTENANCE_MODE = false;

// Whitelisted IPs for maintenance bypass (if enabled)
const WHITELISTED_IPS = [
  '88.183.138.201',
  '127.0.0.1',
  '::1'
];

export function middleware(request: NextRequest) {
  // If maintenance is OFF, grant full public access to everyone worldwide
  if (!IS_MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow static assets, next internals, and maintenance page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/video') ||
    pathname.startsWith('/catalog') ||
    pathname.startsWith('/favicon') ||
    pathname === '/maintenance' ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|js|css|woff|woff2|mp4)$/)
  ) {
    return NextResponse.next();
  }

  // Detect client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  let clientIp = '';
  if (forwardedFor) {
    clientIp = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    clientIp = realIp.trim();
  }

  if (clientIp && WHITELISTED_IPS.includes(clientIp)) {
    return NextResponse.next();
  }

  // Redirect to maintenance
  const maintenanceUrl = new URL('/maintenance', request.url);
  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
