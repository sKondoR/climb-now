import { NextRequest, NextResponse } from 'next/server'
import { parseResults } from '@/lib/parsers'

export async function GET(request: NextRequest) {
  const urlCode = request.nextUrl.searchParams.get('urlCode')
  
  if (!urlCode) {
    return NextResponse.json(
      { error: 'Missing urlCode parameter' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`https://c-f-r.ru/live/${urlCode}/index.html`, { cache: 'no-store' })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results from external API' },
        { status: response.status }
      )
    }

    const html = await response.text()
    const parsedResults = parseResults(html, urlCode)

    return NextResponse.json(parsedResults)
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}