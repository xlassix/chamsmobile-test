import React from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { Image, HStack, Text, LinkBox } from '@chakra-ui/react';
import { DashBoardSVG, World } from '@/assets/svg';
import { useStoreState } from 'easy-peasy';
import { useRouter } from 'next/navigation';

export const menu = [
  {
    name: 'Dashboard',
    icon: DashBoardSVG,
    route: `/`,
  },
];

export const Sidebar = (props: any) => {
  const router = useRouter();

  return (
    <Flex
      height="100%"
      justifyContent="space-between"
      flexDirection="column"
      width="250px"
      padding="1rem 1rem 1rem 2rem"
      bg="#FAFAFA"
      transition="400ms"
      left="0"
      position="absolute"
      sx={
        props.status
          ? {
              caretColor: 'transparent',
              zIndex: '-2',
              left: '-250px',
            }
          : {
              zIndex: '1',
              caretColor: 'transparent',
            }
      }
    >
      <Box>
        <Image
          src={
            'https://chamsmobile.com/wp-content/uploads/2020/01/chams-main-logo.png'
          }
          w="6rem"
          h="3.25rem"
          objectFit={'cover'}
          alt="dd"
        />
        <Box marginTop="4rem">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <LinkBox
                key={i}
                onClick={() => {
                  router.push(item.route);
                }}
                cursor="pointer"
                fontSize={'16px'}
                mb={'14px'}
              >
                <HStack
                  alignContent="center"
                  paddingY="0.5rem"
                  gap="0.5rem"
                  sx={{ color: 'green.500', fill: 'green.500' }}
                >
                  <Box
                    width="20px"
                    children={<Icon height="20px" width="20px" />}
                  />
                  <Text>{item.name}</Text>
                </HStack>
              </LinkBox>
            );
          })}
        </Box>
      </Box>

      <Box>
        <Flex
          alignItems={'center'}
          color="#646777"
          my="1rem"
          sx={{ color: 'green.500', fill: 'green.500' }}
          onClick={() => {}}
        >
          <Icon
            width="30"
            height="30"
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width="30" height="30" fill="url(#needHelp)" />
            <defs>
              <pattern
                id="needHelp"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_724_2820" transform="scale(0.01)" />
              </pattern>
              <image
                id="image0_724_2820"
                width="100"
                height="100"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </Icon>
          <Text mx="0.25rem" fontWeight={'bold'}>
            need Help
          </Text>
        </Flex>
        <Menu>
          <MenuButton>
            <HStack>
              <Box width="20px">
                <World height="20px" width="20px" />
              </Box>
              <Text fontWeight="0.7rem"> EN-English</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => {}}>EN-English</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};
