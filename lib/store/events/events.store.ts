import { makeAutoObservable, runInAction } from 'mobx'
import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { fetchEvents } from '@/lib/api'

export class EventsStore {
  private queryClient: QueryClient
  events: string[] = []
  isEventsLoading: boolean = false
  error: string | null = null

  private EventsQueryObserver: QueryObserver<string[], Error>

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    makeAutoObservable(this)

    this.EventsQueryObserver = new QueryObserver<string[], Error>(this.queryClient, {
      queryKey: ['events'],
      queryFn: fetchEvents,
      staleTime: 1000 * 60 * 60 * 24, // day
    })

    this.setupQuerySubscription()
  }

  private setupQuerySubscription() {
    this.EventsQueryObserver.subscribe((result) => {
      runInAction(() => {
        this.events = result?.data || []
        this.isEventsLoading = false
        this.error = result.error?.message || null
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
