import { BACKEND_API_URL } from '@/shared/constants'
import { cachedWithFallback } from '@/shared/backendCache'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start') || '01-01-2024'
    const endDate = url.searchParams.get('end') || '2026-04-04'

    // Ключ без дат: клиент сдвигает конец диапазона каждый день, а запасной ответ нужен и в новый день
    const data = await cachedWithFallback('events', async () => {
      const response = await fetch(`${BACKEND_API_URL}events?start=${startDate}&end=${endDate}`, {
        headers: {
          'Content-Type': 'application/json',
          ...request.headers
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
      }
      return response.json()
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in events proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
