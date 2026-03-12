import { makeAutoObservable, runInAction } from 'mobx'
import { QueryClient, QueryObserver } from '@tanstack/react-query'

import { fetchEvents } from '@/shared/api'
import { Event } from '@/shared/types/events'

export class EventsStore {
  private queryClient: QueryClient
  events: Event[] = []
  isEventsLoading: boolean = false
  error: string | null = null

  private EventsQueryObserver: QueryObserver<Event[], unknown>

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    makeAutoObservable(this)

    this.EventsQueryObserver = new QueryObserver<Event[], unknown>(this.queryClient, {
      queryKey: ['events'],
      queryFn: fetchEvents,
      staleTime: 1000 * 60 * 60 * 24, // day
      retry: 3,
      retryDelay: 500
    })

    this.setupQuerySubscription()
  }

  private setupQuerySubscription() {
    this.EventsQueryObserver.subscribe((result) => {
      runInAction(() => {
        this.events = result?.data?.sort((a, b) => b.startdate.localeCompare(a.startdate)) || []
        this.isEventsLoading = false
        this.error = result.error instanceof Error ? result.error.message : null
      })
    })
  }

  async refetchEvents() {
    await this.queryClient.refetchQueries({ queryKey: ['events'] })
  }

  invalidateEvents() {
    this.queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  destroy() {
    this.EventsQueryObserver.destroy()
  }
}
