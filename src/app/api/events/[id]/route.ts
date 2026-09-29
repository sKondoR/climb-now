import { SAFE_PATH_SEGMENT } from '@/shared/constants'
import { patchEventLink } from '@/shared/eventsSource'
import { handleApiError } from '@/shared/errorHandler'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const link = body?.link
  if (typeof link !== 'string' || !SAFE_PATH_SEGMENT.test(link)) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  try {
    const event = await patchEventLink(Number(id), link)
    if (!event) {
      return NextResponse.json({ error: `Event with id ${id} not found` }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: event, message: 'Event link updated successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
