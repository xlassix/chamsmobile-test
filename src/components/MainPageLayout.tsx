import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useMediaQuery } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/layout';
import { Sidebar } from './SideBar';
import Nav from './Nav';

export const MainPageLayout = (props: any) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  useLayoutEffect(() => {
    if (isLargerThan768) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [isLargerThan768]);

  return (
    <Flex height="100vh" width="100vw" overflowX="hidden" position="relative">
      <Sidebar status={isCollapsed} />
      <Box
        height="100vh"
        minWidth="300px"
        overflowX="auto"
        width="100%"
        marginLeft="250px"
        sx={{
          '&': {
            ...(isCollapsed ? { marginLeft: 0 } : {}),
          },
        }}
        transition="400ms"
      >
        <Box height="56px" width="100%" bg="white" zIndex="3">
          <Nav
            toggleStatus={() => {
              setIsCollapsed(!isCollapsed);
            }}
          />
        </Box>
        <Box height="calc( 100vh - 56px )" bg="white" overflowY="auto">
          {props.children}
        </Box>
      </Box>
    </Flex>
  );
};
