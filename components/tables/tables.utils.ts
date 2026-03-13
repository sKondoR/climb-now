import {
    leadFinalConfig,
    leadQualConfig,
    leadQualResultsConfig,
    boulderQualConfig,
    boulderFinalConfig,
} from '../../shared/tables.configs'

import { Results, ResultsItem } from '@/shared/types'

export const isCommandMatch = (command: string, selectedCommand: string) => 
    selectedCommand && command.toLowerCase() === selectedCommand.toLowerCase()

export const isNameMatch = (name: string, names: string) => 
    names.toLowerCase()
        .replace('  ', ' ')
        .split(' ')
        .find((a) => name.toLowerCase().includes(a))

interface getConfigProps {
    isLead: boolean
    isBoulder: boolean
    isQualResult: boolean
    isFinal: boolean
}
export function getTableConfig({ isFinal, isQualResult, isLead, isBoulder }: getConfigProps) { 
    if (isLead) {
        if (isFinal) {
            return leadFinalConfig;
        }
        return isQualResult ? leadQualResultsConfig : leadQualConfig;
    }
    if (isBoulder) {
        return (isFinal) ? boulderFinalConfig : boulderQualConfig;
    }
    return leadQualConfig;
}

interface getRowClassesProps {
    resultsLength: number
    result: ResultsItem
    isLead: boolean
    isQualResult: boolean
    isBoulder: boolean
    isFinal: boolean
    command: string
    names: string
    isNamesFilterEnabled: boolean
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

export function getRowClasses({ resultsLength, result, isFinal, isQualResult, isLead, isBoulder, command, names, isNamesFilterEnabled }: getRowClassesProps) { 
    const isSameCommandRow = !isNamesFilterEnabled && isCommandMatch(result.command, command)
    const isSameNameRow = isNamesFilterEnabled && isNameMatch(result.name, names)
    const rank = Number.parseInt(result['rank'])
    const isFinalRow = result['rank'] && (
        (isLead && isFinal && PRIZE_PLACES >= rank) || 
        (isLead && isQualResult && getFinalPlaces(resultsLength, LEAD_FINAL_PLACES) >= rank) ||
        (isBoulder && isFinal && PRIZE_PLACES >= rank) || 
        (isBoulder && !isFinal && getFinalPlaces(resultsLength, BOULDER_FINAL_PLACES) >= rank)
    )
    if (isSameCommandRow || isSameNameRow) {
        return ' bg-blue-200';
    }
    if (isFinalRow) {
        return ' bg-green-200';
    }
    return '';
}

export function getClimbedCount({ results, isLead, isBoulder }: { results: Results, isLead: boolean, isBoulder: boolean }) { 
    return results.filter((result) => {
        if (isBoulder) return 'rank' in result && result.rank !== ''
        if (isLead) return 'score' in result ? result.score !== '' : result.score1 !== ''
        return results.length
    }).length;
}


export function getFinalBorderClass({ resultsLength, isFinalBorderDrawed, isLead, isQualResult, isFinal, isBoulder, rank }:
    { resultsLength:number, isFinalBorderDrawed: boolean, isFinal: boolean, isLead: boolean, isQualResult: boolean, isBoulder: boolean, rank: string }) {
    const place = Number.parseInt(rank);
    return (isFinal && !isFinalBorderDrawed && place > PRIZE_PLACES ) ||
           (isLead && isQualResult && place > getFinalPlaces(resultsLength, LEAD_FINAL_PLACES)) ||
           (!isFinal && isBoulder && place > getFinalPlaces(resultsLength, BOULDER_FINAL_PLACES)) ?
           'border-t-2 border-t-green-500' : ''
}