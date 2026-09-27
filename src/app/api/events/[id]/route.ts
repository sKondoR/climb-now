import { BACKEND_API_URL, SAFE_PATH_SEGMENT } from '@/shared/constants'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!SAFE_PATH_SEGMENT.test(id)) {
    return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: await request.text()
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to patch event: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error in event patch proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
