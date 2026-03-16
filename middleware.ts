import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CSP
  // Generate nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  
  const apiDomains = [
    'https://cfr-search.vercel.app',
  ].join(' ')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self' ${apiDomains};
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')
  
  // Pass nonce to Next.js for inline scripts
  response.headers.set('x-nonce', nonce)

  // CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response
}

export const config = {
  matcher: [
    /*
     * Сопоставляем все пути запросов, кроме тех, что начинаются с:
     * - api (API маршруты)
     * - _next/static (статические файлы)
     * - _next/image (изображения)
     * - favicon.ico (фавикон)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};