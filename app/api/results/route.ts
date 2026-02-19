import { NextRequest, NextResponse } from 'next/server'
import { parseResultsTable } from '@/lib/parsers'
import axios from 'axios'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'
import { ApiError, handleApiError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  const urlCode = request.nextUrl.searchParams.get('urlCode')
  const subgroup = request.nextUrl.searchParams.get('subgroup')
  
  if (!urlCode) {
    throw new ApiError('Missing urlCode parameter', 400)
  }

  try {
    // Add random delay between 50-150ms to avoid rate limiting
      const response = await axios.get(`${EXTERNAL_API_BASE_URL}${urlCode}/${subgroup}.html`)
    
      if (response.status >= 400) {
        throw new ApiError(`Failed to fetch results from external API: ${response.statusText}`, response.status)
      }

     const html = response.data
    console.log('HTML received, starting parsing...')
    const parsed = parseResultsTable(html)
    console.log('Parsing completed, returning results...')
    return NextResponse.json(parsed)
  } catch (error) {
    return handleApiError(error)
  }
}