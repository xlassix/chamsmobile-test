import React, { useEffect, useState } from 'react';
import { Flex, Text, Box, Grid, GridItem } from '@chakra-ui/react';
import { IWallet } from '@/shared/hooks';

type IProp = {
  wallets: IWallet[];
};
export const WalletTabs = (props: IProp) => {
  return (
    <Box padding="1rem">
      <Text px="2rem" fontSize="1.5rem" fontWeight="700">
        Wallets
      </Text>

      <Flex
        flexFlow="row wrap"
        width="100%"
        height="100%"
        paddingX="1rem"
        justifyContent="space-between"
        alignItems="center"
      >
        {props.wallets?.map((elem, ind) => (
          <Box key={`wallet-${ind}`} flexBasis={'33%'}>
            <Box
              padding="1rem"
              p="1rem 1.5rem"
              bg="green.500"
              color="white"
              borderRadius="0.5rem"
            >
              <Text lineHeight="2rem" fontSize="1.5rem" fontWeight="700">
                {elem.name}
              </Text>
              <Flex gap="1rem">
                <Text lineHeight="2rem" fontSize="1rem" fontWeight="700">
                  Account No:
                </Text>
                <Text lineHeight="2rem" fontSize="1rem" fontWeight="700">
                  {elem?.account_no ?? 0}
                </Text>
              </Flex>

              <Box>
                <Text
                  textAlign="right"
                  lineHeight="2rem"
                  fontSize="1rem"
                  fontWeight="700"
                >
                  ₦
                  {parseFloat(elem?.balance)
                    .toFixed(2)
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? 0}
                </Text>
              </Box>
              <Box></Box>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
