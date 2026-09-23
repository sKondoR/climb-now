import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Generate a proper nonce using random bytes and base64 encoding
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64')
  
  // Define API domains properly
  const apiDomains = [
    'https://cfr-search.vercel.app',
  ].join(' ')

  // Yandex Metrika domains: https://yandex.ru/support/metrica/code/install-counter-csp.html
  const metrikaHosts = [
    'mc.yandex.ru', 'mc.yandex.az', 'mc.yandex.by', 'mc.yandex.co.il', 'mc.yandex.com',
    'mc.yandex.com.am', 'mc.yandex.com.ge', 'mc.yandex.com.tr', 'mc.yandex.ee', 'mc.yandex.fr',
    'mc.yandex.kg', 'mc.yandex.kz', 'mc.yandex.lt', 'mc.yandex.lv', 'mc.yandex.md',
    'mc.yandex.tj', 'mc.yandex.tm', 'mc.yandex.uz', 'mc.webvisor.com', 'mc.webvisor.org',
  ]
  const metrikaDomains = [...metrikaHosts.map((h) => `https://${h}`), 'https://yastatic.net'].join(' ')
  const metrikaWsDomains = metrikaHosts.map((h) => `wss://${h}`).join(' ')
  // Metrika UI embeds the site in an iframe for click/scroll maps
  const metrikaFrameAncestors = [
    'metrika.yandex.ru', 'metrika.yandex.by', 'metrika.yandex.com', 'metrika.yandex.com.tr',
    'metrika.yandex.kz', 'metrika.yandex.uz', 'metrika.yandex', 'metrika.ya.ru',
    'metrica.yandex.ru', 'metrica.yandex.by', 'metrica.yandex.com', 'metrica.yandex.com.tr',
    'metrica.yandex.kz', 'metrica.yandex', 'metrica.ya.ru',
    'metr.yandex.ru', 'metr.yandex.by', 'metr.yandex.com', 'metr.yandex.com.tr', 'metr.yandex.kz',
    'analytics.yandex.ru', 'analytics.yandex.by', 'analytics.yandex.com',
    'analytics.yandex.com.tr', 'analytics.yandex.kz',
  ].map((h) => `https://${h}`).join(' ')

  const isDev = process.env.NODE_ENV === 'development'
  // Build CSP header with proper nonce interpolation
  const cspHeader = [
    "default-src 'self';",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''} ${metrikaDomains};`,
    "style-src 'self' 'unsafe-inline';",
    `img-src 'self' data: blob: ${metrikaDomains} https://yandex.ru;`,
    "font-src 'self';",
    `connect-src 'self' ${apiDomains} ${metrikaDomains} ${metrikaWsDomains};`,
    `frame-src blob: ${metrikaDomains};`,
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    `frame-ancestors 'self' ${metrikaFrameAncestors};`,
    "upgrade-insecure-requests;"  // Автоапгрейд HTTP на HTTPS
  ].join(' ');

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')

  // CORS headers (consider restricting in production)
  if (isDev) {
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