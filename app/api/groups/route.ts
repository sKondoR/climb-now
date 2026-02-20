import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { parseResults } from '@/lib/parsers'
import { EXTERNAL_API_BASE_URL } from '@/lib/constants'
import { ApiError, handleApiError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  
  if (!code) {
    return NextResponse.json(null)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 10000)
    
    // Ensure timeout is cleared even if there's an error
    try {
      const response = await axios.get(`${EXTERNAL_API_BASE_URL}${code}/index.html`)
      
      clearTimeout(timeoutId)
      
      if (response.status >= 400) {
        throw new ApiError(`Failed to fetch results from external API: ${response.statusText}`, response.status)
      }

      const html = response.data
      const parsedResults = parseResults(html)

      return NextResponse.json(parsedResults)
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    return handleApiError(error)
  }
}