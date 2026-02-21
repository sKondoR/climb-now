import { Results, ResultsItem } from '@/types'
import {
    leadFinalsConfig,
    leadQualConfig,
    leadQualResultsConfig,
    boulderQualConfig,
    boulderFinalsConfig,
} from './configs'

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
            return leadFinalsConfig;
        }
        return isQualResult ? leadQualResultsConfig : leadQualConfig;
    }
    if (isBoulder) {
        return (isFinal) ? boulderFinalsConfig : boulderQualConfig;
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
export function getRowClasses({ result, isFinal, isQualResult, isLead, isBoulder, command }: getRowClassesProps) { 
    const isCommandRow = isCommandMatch(result.command, command);
    const isFinalRow = 
    (isLead && isFinal && ['1','2','3'].includes(result['rank'])) || 
    (isBoulder && ['1','2','3','4','5','6','7','8','9','10','11','12'].includes(result['rank']));
    if (isCommandRow) {
        return ' bg-blue-400/50';
    }
    if (isFinalRow && !isCommandRow) {
        return ' bg-green-300/30';
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
