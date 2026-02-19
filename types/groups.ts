import { Status } from "./status"

export interface Group {
  id: string
  title: string
  isOnline: boolean
  subgroups: Subgroup[]
}

export interface Subgroup {
  id: string
  title: string
  link: string
  status: Status
  results: Results
}
export type Results = (LeadQualItem | LeadQualResultItem | LeadFinalsItem)[]

export interface LeadQualItem {
  rank: string
  stRank: string
  name: string
  command: string
  score: string
}

export interface LeadQualResultItem {
  rank: string
  name: string
  command: string
  score1: string
  mark1: string
  score2: string
  mark2: string
  mark: string
}

export interface LeadFinalsItem {
  rank: string
  stRank: string
  name: string
  command: string
  qRank: string
  score: string
}

export type LeadResultsItem = LeadQualItem | LeadQualResultItem | LeadFinalsItem
export interface SubgroupResults {
  [key: string]: {
    results: Results
    isLoading: boolean
    error: string | null
  }
}

export interface BoulderQualItem {
  rank: string
  stRank: string
  name: string
  command: string
  score: string
}

export interface BoulderFinalItem {
  rank: string
  stRank: string
  name: string
  command: string
  score: string
}

export interface SubGroupData {
  isLead: boolean
  isBoulder: boolean
  isQualResult: boolean
  isFinal: boolean
  data: Results
}

