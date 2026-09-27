import { BACKEND_API_URL } from '@/shared/constants'
import { NextResponse } from 'next/server'

// Прокси к бэкенду: браузеры из РФ не всегда достают до *.vercel.app напрямую
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}teams`, { signal: AbortSignal.timeout(5000) })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch teams: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error in teams proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
