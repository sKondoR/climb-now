import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Логирование запросов для диагностики
  console.log('Middleware request:', request.url);
  
  // Установка заголовков для CORS и безопасности
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
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