import React, { useEffect, useContext, useState } from 'react';
import {
  Text,
  HStack,
  useMediaQuery,
  Link,
  Avatar,
  Icon,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react';
import { Stack, StackDivider } from '@chakra-ui/layout';
import { Box, Flex } from '@chakra-ui/layout';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { DropDown, Hamburger, SettingsIcon } from '../assets/svg';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';

const Nav = (props: any) => {
  const [openProfileBar, setOpenProfileBar] = useState(true);
  const router = useRouter();

  const user: IUser = useStoreState((action: any) => action?.user.data);
  const logoutAction = useStoreActions(
    (action: any) => action?.user.performLogout
  );

  const handleLogout = () => {
    logoutAction();
    router.push('/login');
  };

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {!isLargerThan768 && (
        <Drawer
          onClose={() => setOpenProfileBar(false)}
          isOpen={openProfileBar}
          size={'full'}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />

            <DrawerBody mt={'24'}>
              <Stack divider={<StackDivider />}>
                <Stack alignItems={'center'}>
                  <Avatar
                    name={`${user?.firstName} ${user?.lastName}`}
                    src={user?.photoUrl}
                    w={'80px'}
                    h={'80px'}
                  />
                  <Text
                    fontSize={'14px'}
                    color={'#5C6370'}
                    fontWeight={'semibold'}
                  >
                    {user?.firstName}
                  </Text>
                </Stack>
                <Stack>
                  <Flex
                    // bgColor={'pink'}
                    alignItems={'center'}
                    py={'8'}
                    onClick={() => {
                      router.push('/settings');
                      setOpenProfileBar(false);
                    }}
                  >
                    <Icon w={['28px']} h={['28px']} as={SettingsIcon} />

                    <Text
                      ml={'5'}
                      fontWeight="600"
                      fontSize="14px"
                      color="#3C4049"
                      noOfLines={1}
                    >
                      Settings
                    </Text>
                    {/* </Box> */}
                  </Flex>
                </Stack>
              </Stack>
            </DrawerBody>
            <DrawerFooter justifyContent={'center'}>
              <Text
                py={'24'}
                fontSize={'14px'}
                color={'#D4112C'}
                fontWeight={'bold'}
                onClick={handleLogout}
              >
                Sign Out
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      <Flex
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        paddingY="1.5rem"
        border=""
        sx={{
          caretColor: 'transparent',
        }}
        marginX="1rem"
        fontWeight="700"
        borderBottom="2px solid #EFF0F2"
      >
        <HStack>
          {!isLargerThan768 && (
            <Icon
              h={'6'}
              w={'6'}
              m={'1'}
              onClick={props.toggleStatus}
              as={Hamburger}
            />
          )}

          {/* <Image w={'6'} h={'6'} src={BetaLogo} /> */}
          <Flex justify={'space-between'}>
            <Text fontSize={{ base: '14px', md: '14px' }}>Dashboard</Text>
          </Flex>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py="0.25rem" onClick={() => setOpenProfileBar(true)}>
              <HStack>
                <Flex>
                  <Avatar
                    // fontSize={'8px'}
                    mr={'1'}
                    borderRadius={['md', 'md']}
                    backgroundColor={'green.100'}
                    color={'gray.300'}
                    w={['8']}
                    h={['8']}
                    name={`${user?.firstName} ${user?.lastName}`}
                    src={user.photoUrl}
                  />
                  <Box
                    textAlign={'start'}
                    display={{ base: 'none', md: 'block' }}
                  >
                    <Text fontWeight="600" fontSize="0.75rem" color="#5C6370">
                      {`${user?.firstName} ${user?.lastName}`}
                    </Text>
                    <Text fontSize="0.65rem" color="#ABB0BA">
                      {user.email}
                    </Text>
                  </Box>
                </Flex>
                <DropDown width="0.5rem" />
              </HStack>
            </MenuButton>

            {isLargerThan768 && (
              <MenuList bg="white" zIndex="popover">
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            )}
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};
export default Nav;
