import { NextRequest, NextResponse } from 'next/server'
import { SAFE_PATH_SEGMENT } from '@/shared/constants'
import { handleApiError } from '@/shared/errorHandler'
import { loadGroups } from '@/shared/groupsSource'

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
    const parsedResults = await loadGroups(code)

    return NextResponse.json(parsedResults)
  } catch (error) {
    // Не в Hawk: 404 здесь штатно приходят, когда клиент подбирает суффикс кода (disciplinesStore.fetchGroups)
    return handleApiError(error)
  }
}
