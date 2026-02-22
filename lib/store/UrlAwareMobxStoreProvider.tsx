'use client';

import { MobxStoreContext, initializeStoreWithUrlCode } from './mobxStore';
import { ReactNode } from 'react';

interface UrlAwareMobxStoreProviderProps {
  children: ReactNode;
}

export const UrlAwareMobxStoreProvider: React.FC<UrlAwareMobxStoreProviderProps> = ({ children }) => {
  const store = initializeStoreWithUrlCode(); // Инициализируем store с кодом из URL
  
  return (
    <MobxStoreContext.Provider value={store}>
      {children}
    </MobxStoreContext.Provider>
  );
};