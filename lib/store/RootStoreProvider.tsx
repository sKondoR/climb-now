'use client';

import { createContext, useContext, ReactNode } from 'react'
import { rootStore, RootStore } from './root.store'

const RootStoreContext = createContext<RootStore | undefined>(undefined)

export const RootStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
