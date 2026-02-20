'use client';

import { MobxStoreContext, initializeStore } from './mobxStore';
import { ReactNode } from 'react';

interface MobxStoreProviderProps {
  children: ReactNode;
}

export const MobxStoreProvider: React.FC<MobxStoreProviderProps> = ({ children }) => {
  const store = initializeStore();
  return (
    <MobxStoreContext.Provider value={store}>
      {children}
    </MobxStoreContext.Provider>
  );
};