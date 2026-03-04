import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start') || '01-01-2024'
    const endDate = url.searchParams.get('end') || '2026-04-04'

    const response = await fetch(`https://cfr-search.vercel.app/api/events?start=${startDate}&end=${endDate}`, {
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch events: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in events proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}