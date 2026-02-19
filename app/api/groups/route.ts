import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { parseResults } from '@/lib/parsers'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'
import { ApiError, handleApiError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  const urlCode = request.nextUrl.searchParams.get('urlCode')
  
  if (!urlCode) {
    throw new ApiError('Missing urlCode parameter', 400)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 10000)
    
    // Ensure timeout is cleared even if there's an error
    try {
      const response = await axios.get(`${EXTERNAL_API_BASE_URL}${urlCode}/index.html`)
      
      clearTimeout(timeoutId)
      
      if (response.status >= 400) {
        throw new ApiError(`Failed to fetch results from external API: ${response.statusText}`, response.status)
      }

      const html = response.data
      const parsedResults = parseResults(html, urlCode)

      return NextResponse.json(parsedResults)
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    return handleApiError(error)
  }
}