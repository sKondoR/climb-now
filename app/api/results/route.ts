import { NextRequest, NextResponse } from 'next/server'
import { parseResultsTable } from '@/lib/parsers'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'
import { ApiError, handleApiError } from '@/lib/errorHandler'
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

export async function GET(request: NextRequest) {
  const urlCode = request.nextUrl.searchParams.get('urlCode')
  const subgroup = request.nextUrl.searchParams.get('subgroup')
  
  if (!urlCode) {
    throw new ApiError('Missing urlCode parameter', 400)
  }

  try {
    // Add random delay between 50-150ms to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    const response = await fetch(`${EXTERNAL_API_BASE_URL}${urlCode}/${subgroup}.html`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
    
    if (!response.ok) {
      throw new ApiError(`Failed to fetch results from external API: ${response.statusText}`, response.status)
    }

    const html = await response.text()
    console.log('HTML received, starting parsing...')
    const parsed = parseResultsTable(html)
    console.log('Parsing completed, returning results...')
    return NextResponse.json(parsed)
  } catch (error) {
    return handleApiError(error)
  }
}