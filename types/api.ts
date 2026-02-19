import { Group } from "./groups"
export interface Discipline { 
  discipline: string
  groups: Group[]
}

export interface AllData {
  data: Discipline[]
  url: string
}

