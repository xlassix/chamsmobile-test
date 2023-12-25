'use client';

import Image from 'next/image';
import styles from './page.module.css';
import React, { use, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { useRouter } from 'next/navigation';
import { date } from 'yup';
import { MainPageLayout } from '@/components/MainPageLayout';
import { useDashboardData } from '@/shared/hooks';
import { WalletTabs } from '@/components/BalanceTab';
import { Button } from '@/components/FormComponents';
import { Box, Flex } from '@chakra-ui/react';
import { TransferModal } from '@/components/TransferModal';
import { TransactionTable } from '@/components/TransactionTable';

export default function Home() {
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const isAuthenticated = useStoreState(
    (state: any) => state.user.isAuthenticated
  );

  const storeUserInfo = useStoreState((state: any) => state.user.data);

  const { data, error, isLoading } = useDashboardData(storeUserInfo.walletID);
  React.useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, []);

  return (
    <MainPageLayout>
      <WalletTabs wallets={data?.user?.wallets ?? []} />
      <Flex alignItems="flex-end" pr="1.5rem">
        <Button ml="auto" onClick={() => setModal(true)}>
          Transfer
        </Button>
        <TransferModal status={modal} setStatus={setModal} user={data?.user} />
      </Flex>
      <TransactionTable
        isLoading={isLoading}
        transactions={data?.transactions ?? []}
      />
    </MainPageLayout>
  );
}
