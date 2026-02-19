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
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 30000)
    
    // Ensure timeout is cleared even if there's an error
    try {
      const response = await fetch(`${EXTERNAL_API_BASE_URL}${urlCode}/${subgroup}`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        console.error('Failed to fetch results from external API with status:', response.status)
        return NextResponse.json(
          { error: `Failed to fetch results from external API: ${response.statusText}` },
          { status: response.status }
        )
      }

      const html = await response.text()
      console.log('HTML received, starting parsing...')
      const parsed = parseResultsTable(html)
      console.log('Parsing completed, returning results...')
      return NextResponse.json(parsed)
    } catch (error) {
      clearTimeout(timeoutId)
      // Handle network errors specifically
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch failed')) {
        console.error('Network error while fetching results:', error)
        return NextResponse.json(
          { error: 'External API connection failed. Please try again later.' },
          { status: 502 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching results:', error)
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again later.' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}