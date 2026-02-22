'use client';

import { MobxStoreContext, initializeStore } from './mobxStore';
import { ReactNode } from 'react';

interface MobxStoreProviderProps {
  children: ReactNode;
  initialCode?: string;
}

export const MobxStoreProvider: React.FC<MobxStoreProviderProps> = ({ children, initialCode }) => {
  const store = initializeStore(initialCode);
  return (
    <MobxStoreContext.Provider value={store}>
      {children}
    </MobxStoreContext.Provider>
  );
};