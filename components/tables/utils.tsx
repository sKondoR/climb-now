import { LeadResultsItem } from '@/types'
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
    result: LeadResultsItem
    isLead: boolean
    isQualResult: boolean
    isFinal: boolean
    command: string
}
export function getRowClasses({ result, isFinal, isQualResult, isLead, command }: getRowClassesProps) { 
    const isCommandRow = isCommandMatch(result.command, command);
    const isFinalRow = isFinal && ['1','2','3'].includes(result['rank']);
    if (isCommandRow) {
        return ' bg-blue-400/50';
    }
    if (isFinalRow && !isCommandRow) {
        return ' bg-green-300/30';
    }
    return '';
}