import { DEFAULT_TEAMS } from '@/shared/constants'
import { NextResponse } from 'next/server'

// Список команд меняется раз в сезон, поэтому он зашит в код, а не парсится с c-f-r.ru
export async function GET() {
  return NextResponse.json({ teams: DEFAULT_TEAMS })
}
