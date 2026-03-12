import { QueryClient } from '@tanstack/react-query'
import { TeamsStore } from './teams/teams.store'
import { DisciplinesStore } from './disciplines/disciplines.store'
import { FormStore } from './form/form.store'
import { EventsStore } from './events/events.store'

export class RootStore {
  queryClient: QueryClient
  teamsStore: TeamsStore
  formStore: FormStore
  disciplinesStore: DisciplinesStore
  eventsStore: EventsStore

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 3,
        },
      },
    })

    this.teamsStore = new TeamsStore(this.queryClient)
    this.formStore = new FormStore()
    this.disciplinesStore = new DisciplinesStore(this.queryClient)
    this.eventsStore = new EventsStore(this.queryClient)
  }

  destroy() {
    this.teamsStore.reset()
    this.formStore.reset()
    this.disciplinesStore.reset()
    this.queryClient.clear()
  }
}

export const rootStore = new RootStore()
