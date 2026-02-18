import { NextRequest, NextResponse } from 'next/server'
import { parseResultsTable } from '@/lib/parsers'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const urlCode = request.nextUrl.searchParams.get('urlCode')
  const subgroup = request.nextUrl.searchParams.get('subgroup')
  
  if (!urlCode) {
    return NextResponse.json(
      { error: 'Missing urlCode parameter' },
      { status: 400 }
    )
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(`${EXTERNAL_API_BASE_URL}${urlCode}/${subgroup}`, {
      cache: 'no-store',
      signal: controller.signal
    })
    
    clearTimeout(timeout)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results from external API' },
        { status: response.status }
      )
    }

    const html = await response.text()
    const parsed = parseResultsTable(html)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}