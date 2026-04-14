import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Generate a proper nonce using random bytes and base64 encoding
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64')
  
  // Define API domains properly
  const apiDomains = [
    'https://cfr-search.vercel.app',
  ].join(' ')

  // Build CSP header with proper nonce interpolation
  const cspHeader = [
    "default-src 'none';",
    `script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' https:;`,
    "style-src 'nonce-${nonce}' 'unsafe-inline';",
    "img-src 'self' data: blob:;",
    "font-src 'self';",
    `connect-src 'self' ${apiDomains} https://climbnow-skondor.amvera.io/;`,
    "object-src 'none';",
    "base-uri 'none';",
    "form-action 'self';",
    "frame-ancestors 'none';",
    "upgrade-insecure-requests;"  // Автоапгрейд HTTP на HTTPS
  ].join(' ');

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')
  
  // Pass nonce to Next.js for inline scripts
  response.headers.set('x-nonce', nonce)

  // CORS headers (consider restricting in production)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}