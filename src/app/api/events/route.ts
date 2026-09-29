import { getEvents } from '@/shared/eventsSource'
import { handleApiError } from '@/shared/errorHandler'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  try {
    const data = await getEvents(searchParams.get('start'), searchParams.get('end'))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return handleApiError(error)
  }
}
