import { Group } from "./groups"
export interface Event {
  link: string
  location: string
  date: string
  year: string
}

export interface Discipline { 
  discipline: string
  groups: Group[]
}


