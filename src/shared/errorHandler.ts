import { NextResponse } from 'next/server';
import axios from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Ошибки axios от c-f-r.ru переводим в ApiError, чтобы клиент отличал таймаут и недоступность сайта
const toApiError = (error: unknown): unknown => {
  if (!axios.isAxiosError(error)) return error;
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return createTimeoutError('External API timeout');
  }
  if (error.response) {
    const status = error.response.status;
    return new ApiError(`External API responded with ${status}`, status >= 500 ? 502 : status);
  }
  return createNetworkError('External API unavailable');
};

export const handleApiError = (rawError: unknown): NextResponse => {
  const error = toApiError(rawError);
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, 'Status:', error.statusCode);
    
    // Для сетевых ошибок возвращаем 503
    if (error.isNetworkError) {
      return NextResponse.json(
        { error: error.message || 'External API temporarily unavailable' },
        { status: 503 }
      );
    }
    
    // Для таймаутов возвращаем 504
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: error.message || 'Request timeout' },
        { status: 504 }
      );
    }
    
    // Для других ошибок возвращаем указанный статус
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode }
    );
  }
  
  // Для неизвестных ошибок
  console.error('Unknown error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

export const createNetworkError = (message: string): ApiError => {
  return new ApiError(message, 502, true);
};

export const createTimeoutError = (message: string): ApiError => {
  return new ApiError(message, 504);
};