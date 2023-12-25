import * as React from 'react';
import { Text, useMediaQuery } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/layout';

export const AuthLayout = (props: any) => {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  return (
    <>
      {isLargerThan800 ? (
        <Flex height="100vh">
          <Box flexBasis="70%" overflowY="auto" padding="1.5rem">
            {props.children}
          </Box>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            flexBasis="30%"
            bg="#38910F"
            color="white"
            paddingX="2.75rem"
            position="relative"
          ></Flex>
        </Flex>
      ) : (
        <Box overflowY="auto" paddingX="1rem">
          {props.children}
        </Box>
      )}
    </>
  );
};
