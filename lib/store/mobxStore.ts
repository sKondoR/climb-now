import { makeAutoObservable, configure } from 'mobx'
import { DEFAULT_CITY } from '../constants'
import { createContext, useContext } from 'react'
import type { Discipline } from '../../types/disciplines';

// Configure MobX for SSR compatibility
configure({
  safeDescriptors: true,
});

export class MobxStore {
  code: string = ''
  command: string = DEFAULT_CITY
  isCommandFilterEnabled: boolean = false
  isOnlyOnline: boolean = false
  isDisciplinesLoading: boolean = false
  disciplinesData: Discipline[] | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCode(code: string) {
    this.code = code
  }

  setCommand(command: string) {
    this.command = command
  }

  setIsCommandFilterEnabled(enabled: boolean) {
    this.isCommandFilterEnabled = enabled
  }

  setIsOnlyOnline(enabled: boolean) {
    this.isOnlyOnline = enabled
  }

  setIsDisciplinesLoading(enabled: boolean) {
    this.isDisciplinesLoading = enabled
  }

  setDisciplinesData(data: Discipline[] | null) {
    this.disciplinesData = data
  }

  reset() {
    this.code = ''
    this.command = DEFAULT_CITY
    this.isCommandFilterEnabled = false;
    this.isOnlyOnline = false
    this.isDisciplinesLoading = false
    this.disciplinesData = null
  }
}

// Create a function to initialize the store
let store: MobxStore | null = null

export function initializeStore() {
  if (typeof window === 'undefined') {
    // On server side, create a new instance every time
    return new MobxStore()
  } else {
    // On client side, use singleton pattern
    if (store === null) {
      store = new MobxStore()
    }
    return store
  }
}

export const MobxStoreContext = createContext<MobxStore | undefined>(undefined)

export const useMobxStore = () => {
  const context = useContext(MobxStoreContext)
  if (!context) {
    // Fallback to initializing store if context is not available
    return initializeStore()
  }
  return context
};

// Export the store instance as well for direct access when needed
// For direct access to the store instance
export function mobxStore() {
  return initializeStore()
}