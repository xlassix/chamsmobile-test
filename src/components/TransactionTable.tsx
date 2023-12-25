import { ITransaction } from '@/shared/hooks';
import {
  TableContainer,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  HStack,
  Flex,
  Button,
  Text,
  Tbody,
  useMediaQuery,
  Box,
  Spinner,
  useToast,
  Input,
  Icon,
  StackDivider,
  Stack,
} from '@chakra-ui/react';

type Prop = {
  transactions: ITransaction[];
  isLoading: boolean;
};

const tableOrder = [
  {
    name: 'Transaction Id',
    value: 'txRef',
  },
  {
    name: 'Beneficiary AccountName',
    value: 'beneficiary_account_name',
  },
  {
    name: 'Beneficiary Account Number',
    value: 'beneficiary_account_number',
  },
  {
    name: 'Amount',
    value: 'transferAmount',
  },
];

export const TransactionTable = (prop: Prop) => {
  const [isLargerThan568] = useMediaQuery('(min-width: 568px)');
  return (
    <Box>
      {isLargerThan568 ? (
        <TableContainer
          padding="1rem"
          borderRadius="0.75rem"
          bg="white"
          fontWeight="500"
          marginBottom="1.75rem"
        >
          <Table padding="1rem">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <Thead bg="#FAFAFC" borderRadius="full">
              <Tr>
                {tableOrder.map((elem: any, i) => (
                  <Th
                    textTransform="capitalize"
                    letterSpacing="0.25px"
                    fontWeight="400"
                    key={`header-${i}`}
                    color="#666481"
                  >
                    {elem.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {prop.transactions?.length === 0 && !prop.isLoading && (
                <Tr height="75vh">
                  <Td colSpan={tableOrder.length}>
                    <Flex justifyContent="center">{'noRecordFound'}</Flex>
                  </Td>
                </Tr>
              )}
              {prop.transactions?.map((elem: any) => (
                <Tr
                  key={`$customer-${elem?.Id}`}
                  color="#000000"
                  fill="#000000"
                  cursor="pointer"
                >
                  {tableOrder.map((item) => {
                    return (
                      <>
                        {item?.value == 'transferAmount' ? (
                          <Td
                            sx={{ caretColor: 'transparent' }}
                            paddingY="0.2rem"
                          >
                            ₦
                            {parseFloat(elem[item.value])
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </Td>
                        ) : (
                          item?.value !== 'action' && (
                            <Td
                              key={`${elem.id}-${item.name}`}
                              fontSize="0.8rem"
                              paddingY="0.2rem"
                              fontWeight="400"
                            >
                              {elem[item.value]}
                            </Td>
                          )
                        )}
                      </>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Flex flexDirection={'column'} alignItems="center">
          {prop.transactions?.map((elem, ind) => (
            <Box
              minH={'40'}
              border={'2px'}
              p={6}
              w="90%"
              mt={'4'}
              mb={'4'}
              borderColor={'gray.300'}
              rounded={'md'}
              key={`mobile-table-${ind}`}
              fontSize={'14px'}
            >
              <Stack divider={<StackDivider />}>
                <Flex
                  justifyContent="space-between"
                  // borderBottom="1px solid #EFF0F2"
                  padding="0.25rem"
                >
                  <Text>Trasaction Ref:</Text>
                  <Text>{elem.txRef}</Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  // borderBottom="1px solid #EFF0F2"
                  padding="0.25rem"
                >
                  <Text>Beneficiary Account Name:</Text>
                  <Text>{elem.beneficiary_account_name}</Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  padding="0.25rem"
                  // borderBottom="1px solid #EFF0F2"
                >
                  <Text>Beneficiary Account Number:</Text>
                  <Text>{elem.beneficiary_account_number}</Text>
                </Flex>
                <Flex justifyContent="space-between" padding="0.25rem">
                  <Text>Amount:</Text>
                  <Text>{elem.transferAmount}</Text>
                </Flex>
                {/* <Flex justifyContent="space-between" padding="0.25rem">
                                        <Text>CreatedAt:</Text>
                                        <Text>{elem.createdAt}</Text>
                                    </Flex> */}
              </Stack>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};
