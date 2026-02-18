import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { urlCode: string; subgroupLink: string } }
) {
  try {
    const { urlCode, subgroupLink } = params
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(
      `https://c-f-r.ru/live/${urlCode}/${subgroupLink}`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Next.js API Client',
        },
        signal: controller.signal
      }
    )
    
    clearTimeout(timeout)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch results: ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    
    return NextResponse.json(
      { 
        success: true,
        data: html,
        urlCode,
        subgroupLink
      }
    )
  } catch (error) {
    console.error('API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}