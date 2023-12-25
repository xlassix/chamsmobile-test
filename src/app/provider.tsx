// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import { StoreProvider } from 'easy-peasy';
import { stores } from '@/stores';

export function Providers({ children }: { children: React.ReactNode }) {
  const StoreProviderCasted = StoreProvider as any;
  return (
    <StoreProviderCasted store={stores}>
      <SWRConfig value={{}}>
        <ChakraProvider>{children}</ChakraProvider>
      </SWRConfig>
    </StoreProviderCasted>
  );
}
