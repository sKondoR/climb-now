import {
    leadFinalConfig,
    leadQualConfig,
    leadQualResultsConfig,
    boulderQualConfig,
    boulderFinalConfig,
} from '../../shared/tables.configs'

import { Results, ResultsItem } from '@/shared/types'

export const isCommandMatch = (command: string, selectedCommand: string) => {
    return selectedCommand && command.toLowerCase() === selectedCommand.toLowerCase()
}

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
    result: ResultsItem
    isLead: boolean
    isQualResult: boolean
    isBoulder: boolean
    isFinal: boolean
    command: string
}

export const PRIZE_PLACES = ['1','2','3'];
export const LEAD_FINAL_PLACES = ['1','2','3','4','5','6','7','8','9','10'];
export const BOULDER_FINAL_PLACES = ['1','2','3','4','5','6','7','8','9','10','11','12'];

export function getRowClasses({ result, isFinal, isQualResult, isLead, isBoulder, command }: getRowClassesProps) { 
    const isCommandRow = isCommandMatch(result.command, command)
    const isFinalRow = 
    (isLead && isFinal && PRIZE_PLACES.includes(result['rank'])) || 
    (isLead && isQualResult && LEAD_FINAL_PLACES.includes(result['rank'])) ||
    (isBoulder && isFinal && PRIZE_PLACES.includes(result['rank'])) || 
    (isBoulder && !isFinal && BOULDER_FINAL_PLACES.includes(result['rank']));
    if (isCommandRow) {
        return ' bg-blue-200';
    }
    if (isFinalRow && !isCommandRow) {
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


export function getFinalBorderClass({ isFinalBorderDrawed, isLead, isQualResult, isFinal, isBoulder, rank }:
    { isFinalBorderDrawed: boolean, isFinal: boolean, isLead: boolean, isQualResult: boolean, isBoulder: boolean, rank: string }) {
    const place = Number.parseInt(rank);
    return (isFinal && !isFinalBorderDrawed && place > PRIZE_PLACES.length ) ||
           (isLead && isQualResult && place > LEAD_FINAL_PLACES.length) ||
           (!isFinal && isBoulder && place > BOULDER_FINAL_PLACES.length) ?
           'border-t-2 border-t-green-500' : ''
}