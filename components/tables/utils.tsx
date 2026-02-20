import { LeadResultsItem } from '@/types'
import {
    leadFinalsConfig,
    leadQualConfig,
    leadQualResultsConfig,
    boulderQualConfig,
    boulderFinalsConfig,
} from './configs'

export const isCityMatch = (city: string, selectedCity: string) => {
    return selectedCity && city.toLowerCase() === selectedCity.toLowerCase()
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
    city: string
}
export function getRowClasses({ result, isFinal, isQualResult, isLead, city }: getRowClassesProps) { 
    const isCityRow = isCityMatch(result.command, city);
    const isFinalRow = isFinal && ['1','2','3'].includes(result['rank']);
    if (isCityRow) {
        return ' bg-blue-400/50';
    }
    if (isFinalRow && !isCityRow) {
        return ' bg-green-300/30';
    }
    return '';
}