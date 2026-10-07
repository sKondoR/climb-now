import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { parseResults } from '@/shared/parser/parsers'
import { EXTERNAL_API_BASE_URL, EXTERNAL_API_TIMEOUT, SAFE_PATH_SEGMENT } from '@/shared/constants'
import { handleApiError } from '@/shared/errorHandler'
import { cached } from '@/shared/upstreamCache'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(null)
  }

  if (!SAFE_PATH_SEGMENT.test(code)) {
    return NextResponse.json({ error: 'Invalid code parameter' }, { status: 400 })
  }

  try {
    // toDo: Add random delay between 50-150ms to avoid rate limiting
    const url = `${EXTERNAL_API_BASE_URL}${code}/index.html`
    const parsedResults = await cached(url, async () => {
      const response = await axios.get(url, { timeout: EXTERNAL_API_TIMEOUT })
      return parseResults(response.data)
    })

    return NextResponse.json(parsedResults)
  } catch (error) {
    // Не в Hawk: 404 здесь штатно приходят, когда клиент подбирает суффикс кода (disciplinesStore.fetchGroups)
    return handleApiError(error)
  }
}
