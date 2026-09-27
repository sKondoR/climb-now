import { BACKEND_API_URL } from '@/shared/constants'
import { cachedWithFallback } from '@/shared/backendCache'
import { NextResponse } from 'next/server'

// Прокси к бэкенду: браузеры из РФ не всегда достают до *.vercel.app напрямую
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const data = await cachedWithFallback('teams', async () => {
      const response = await fetch(`${BACKEND_API_URL}teams`)
      if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`)
      }
      return response.json()
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in teams proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
