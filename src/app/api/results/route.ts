import { NextRequest, NextResponse } from 'next/server'
import { parseResultsTable } from '@/shared/parser/parsers'
import axios from 'axios'
import { EXTERNAL_API_BASE_URL, EXTERNAL_API_TIMEOUT, SAFE_PATH_SEGMENT } from '@/shared/constants'
import { handleApiError } from '@/shared/errorHandler'
import { cached } from '@/shared/upstreamCache'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const subgroup = searchParams.get('subgroup')

  if (!code || !subgroup || !SAFE_PATH_SEGMENT.test(code) || !SAFE_PATH_SEGMENT.test(subgroup)) {
    return NextResponse.json({ error: 'Missing or invalid code/subgroup parameter' }, { status: 400 })
  }

  try {
    // toDo: Add random delay between 50-150ms to avoid rate limiting
    const url = `${EXTERNAL_API_BASE_URL}${code}/${subgroup}.html`
    const parsed = await cached(url, async () => {
      const response = await axios.get(url, { timeout: EXTERNAL_API_TIMEOUT })
      return parseResultsTable(response.data)
    })
    return NextResponse.json(parsed)
  } catch (error) {
    return handleApiError(error)
  }
}
