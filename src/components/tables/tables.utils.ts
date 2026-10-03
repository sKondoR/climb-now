import {
    leadFinalConfig,
    leadQualConfig,
    leadQualResultsConfig,
    boulderQualConfig,
    boulderFinalConfig,
    speedQualConfig,
} from '../../shared/tables.configs'

import { Results, ResultsItem, SpeedFinalItem } from '@/shared/types'
import { getSpeedRoundName, getSpeedStepsToFinal } from '@/shared/speedRounds'

export const isCommandMatch = (command: string, selectedCommand: string) => 
    !!selectedCommand && command.toLowerCase() === selectedCommand.toLowerCase()

export const isNameMatch = (name: string, names: string) => {
    const searchTerms = names
        .toLowerCase()
        .replaceAll(';', ',')
        .split(',')
        .map((term) => term.trim().replace(/\s+/g, ' '))
        .filter((term) => term !== '')

    const normalizedName = name.trim().toLowerCase()
    return searchTerms.some((term) => normalizedName.includes(term))
}

interface getConfigProps {
    isLead: boolean
    isBoulder: boolean
    isSpeed?: boolean
    isQualResult: boolean
    isFinal: boolean
}
export function getTableConfig({ isFinal, isQualResult, isLead, isBoulder, isSpeed }: getConfigProps) { 
    if (isLead) {
        if (isFinal) {
            return leadFinalConfig
        }
        return isQualResult ? leadQualResultsConfig : leadQualConfig
    }
    if (isBoulder) {
        return (isFinal) ? boulderFinalConfig : boulderQualConfig
    }
    if (isSpeed && !isFinal) {
        return speedQualConfig
    }
    return leadQualConfig
}

interface getRowClassesProps {
    result: ResultsItem
    command: string
    names: string
    isNamesFilterEnabled: boolean
    isFinal: boolean
}

export const PRIZE_PLACES = 3
export const LEAD_FINAL_PLACES = 10
export const BOULDER_FINAL_PLACES = 12
export const PARTICIPANTS_COEF = 0.75

export const getFinalPlaces = (resultsLength: number, standard: number) => {
    const mathPlaces = Math.ceil(resultsLength * PARTICIPANTS_COEF)
    if (mathPlaces >= standard) {
        return standard
    }
    if (mathPlaces >= standard - 2) {
        return standard - 2
    }
    if (mathPlaces >= standard - 4) {
        return standard - 4
    }
    return standard - 6
}

// own — своя команда или скалолаз из списка, podium — призёр финала, qualified — проходит дальше (класс q в протоколе ФСР)
export type RowHighlight = 'own' | 'podium' | 'qualified' | null

type OwnRowProps = Pick<getRowClassesProps, 'command' | 'names' | 'isNamesFilterEnabled'>

// «Свои» — выбранная команда, а в режиме фамилий — введённые скалолазы (тоже команда). Одно правило для подсветки и фильтра
export const isOwnRow = (result: ResultsItem, { command, names, isNamesFilterEnabled }: OwnRowProps) =>
    isNamesFilterEnabled ? isNameMatch(result.name, names) : isCommandMatch(result.command, command)

// Флажок «только команда»: свои плюс первое место для ориентира; если своих нет — пусто
export function filterOwnResults<T extends ResultsItem>(results: T[], props: OwnRowProps): T[] {
    if (!results.some((result) => isOwnRow(result, props))) return []
    return results.filter((result) => result.rank === '1' || isOwnRow(result, props))
}

// В финалах скорости соперник важен не меньше своего: оставляем забеги со своими целиком
export function filterOwnHeats(results: SpeedFinalItem[], props: OwnRowProps): SpeedFinalItem[] {
    const ownHeats = new Set(results.filter((result) => isOwnRow(result, props)).map((result) => `${result.round}|${result.heat}`))
    return results.filter((result) => ownHeats.has(`${result.round}|${result.heat}`))
}

export interface SpeedBracketRound {
    name: string
    // Забеги по порядку сетки; ещё не пройденный забег — пустой массив
    heats: SpeedFinalItem[][]
}

// Раскладка сетки-дерева: все раунды от первого до финала, в каждом 2^шагов_до_финала забегов,
// даже если они ещё не начались. Забег за III место — отдельно: в дереве он ни с чем не связан
export function getSpeedBracketRounds(results: SpeedFinalItem[]): { rounds: SpeedBracketRound[], bronze: SpeedFinalItem[] | null } {
    if (!results.length) return { rounds: [], bronze: null }
    const firstSteps = Math.max(...results.map((result) => getSpeedStepsToFinal(result.round)))
    const getHeat = (round: string, heat: number) => results.filter((result) => result.round === round && result.heat === heat)
    const rounds = Array.from({ length: firstSteps + 1 }, (_, i) => {
        const steps = firstSteps - i
        const name = getSpeedRoundName(steps)
        return { name, heats: Array.from({ length: 2 ** steps }, (_, heat) => getHeat(name, heat)) }
    })
    return { rounds, bronze: firstSteps > 0 ? getHeat(getSpeedRoundName(0), 1) : null }
}

export function getRowHighlight({ result, command, names, isNamesFilterEnabled, isFinal }: getRowClassesProps): RowHighlight {
    const rank = Number.parseInt(result['rank'])
    if (isOwnRow(result, { command, names, isNamesFilterEnabled })) return 'own'
    if (result['rank'] && isFinal && PRIZE_PLACES >= rank) return 'podium'
    if (result.isHighlighted) return 'qualified'
    return null
}

// Цвет строки — не единственный признак: экранный чтец слышит эту приписку после имени
export const ROW_HIGHLIGHT_LABELS: Record<Exclude<RowHighlight, null>, string> = {
    own: 'ваш скалолаз',
    podium: 'призёр',
    qualified: 'проходит дальше',
}

export function getRowClasses(props: getRowClassesProps) {
    const highlight = getRowHighlight(props)
    if (highlight === 'own') return ' bg-blue-200'
    if (highlight) return ' bg-green-200'
    return ''
}

export function getClimbedCount({ results, isLead, isBoulder, isSpeed }: { results: Results, isLead: boolean, isBoulder: boolean, isSpeed?: boolean }) { 
    return results.filter((result) => {
        if (isBoulder) return 'rank' in result && result.rank !== ''
        if (isLead || isSpeed) return 'score' in result ? result.score !== '' : result.score1 !== ''
        return results.length
    }).length
}

// Ключ строки — сам скалолаз, а не позиция: после пересортировки React переиспользует ту же строку, и её можно довести до нового места
export function getRowKeys(results: ResultsItem[]) {
    const seen = new Map<string, number>()
    return results.map((result) => {
        const base = `${result.name}|${result.command}`
        const count = seen.get(base) ?? 0
        seen.set(base, count + 1)
        return count ? `${base}|${count}` : base
    })
}

// Место меняется у всех, кого обогнали, поэтому в подпись не входит: подсвечиваем только тех, у кого изменился собственный результат
export const getRowSignature = (result: ResultsItem) =>
    JSON.stringify(Object.entries(result).filter(([key]) => key !== 'rank' && key !== 'isHighlighted'))
