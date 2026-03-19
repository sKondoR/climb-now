'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { rootStore, RootStore } from './root.store'

const RootStoreContext = createContext<RootStore | undefined>(undefined)

export const RootStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Load code from URL on client-side mount
    rootStore.formStore.loadFromUrl()
  }, [])

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}

export const useRootStore = () => {
  const context = useContext(RootStoreContext)
  if (!context) {
    throw new Error('useRootStore must be used within a RootStoreProvider')
  }
  return context
}
