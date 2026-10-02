import { NextRequest, NextResponse } from 'next/server'
import { parseResultsTable } from '@/shared/parser/parsers'
import axios from 'axios'
import { EXTERNAL_API_BASE_URL, EXTERNAL_API_TIMEOUT, SAFE_PATH_SEGMENT } from '@/shared/constants'
import { handleApiError } from '@/shared/errorHandler'
import { cached } from '@/shared/upstreamCache'
import { SubGroupData } from '@/shared/types'

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
    const parsed = await fetchParsed(code, subgroup)
    if (parsed.isSpeed && parsed.isFinal) {
      return NextResponse.json(await withSpeedCommands(parsed, code, subgroup))
    }
    return NextResponse.json(parsed)
  } catch (error) {
    return handleApiError(error)
  }
}

const fetchParsed = (code: string, subgroup: string) => {
  const url = `${EXTERNAL_API_BASE_URL}${code}/${subgroup}.html`
  return cached(url, async () => {
    const response = await axios.get(url, { timeout: EXTERNAL_API_TIMEOUT })
    return parseResultsTable(response.data)
  })
}

// В сетке финалов скорости нет команд: берём их из квалификации той же группы (e16_f_m → e_q_m, s8_4f_f10 → s_q_f10).
// В сетке на блоках div имена сокращены («Шепелева С.») — подставляем полные, чтобы работал поиск по фамилиям.
// Без квалификации отдаём сетку как есть
const withSpeedCommands = async (parsed: SubGroupData, code: string, subgroup: string): Promise<SubGroupData> => {
  const qualSubgroup = subgroup.replace(/^([es])\d+_\d*f_/, '$1_q_')
  if (qualSubgroup === subgroup) return parsed
  try {
    const qual = await fetchParsed(code, qualSubgroup)
    const climbers = new Map<string, { name: string, command: string } | null>()
    qual.data.forEach(({ name, command }) => {
      climbers.set(name, { name, command })
      const [surname, firstName] = name.split(' ')
      if (!firstName) return
      // Длинные фамилии в сетке идут вовсе без инициала («Могильникова»).
      // Неоднозначное сокращение (однофамильцы) не раскрываем
      for (const short of [`${surname} ${firstName[0]}.`, surname]) {
        climbers.set(short, climbers.has(short) ? null : { name, command })
      }
    })
    return {
      ...parsed,
      data: parsed.data.map((item) => {
        const climber = climbers.get(item.name)
        return climber ? { ...item, ...climber } : { ...item, command: '' }
      }),
    }
  } catch {
    return parsed
  }
}
