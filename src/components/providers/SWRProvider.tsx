'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { swrConfig, createCacheProvider } from '@/lib/swr-config';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        ...swrConfig,
        provider: createCacheProvider,
      }}
    >
      {children}
    </SWRConfig>
  );
}