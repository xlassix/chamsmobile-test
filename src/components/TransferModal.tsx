import { IChamsUser } from '@/shared/hooks';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  FormControl,
  FormErrorMessage,
  Heading,
  Button,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Link,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import { CustomInput } from './FormComponents';
import { useState } from 'react';
import { transfer } from '@/shared/api';
import { useSWRConfig } from 'swr';
import { IUser } from '@/types';

type IProp = {
  status: boolean;
  setStatus: any;
  user: IChamsUser;
};
export const TransferModal = (props: IProp) => {
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleTransfer = async (val: any) => {
    try {
      setIsSubmitting(true);
      let response = await transfer(val);
      if (response?.statusCode === 200) {
        mutate(`/account?user=${props.user.id}`);
        props.setStatus(false);
      } else {
        setErrMsg(response?.error.message ?? response?.error);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      if (err?.response?.status === 500) {
        setErrMsg('Transfer Failed');
      } else {
        setErrMsg(
          err?.response?.data?.error.message ??
            err?.response?.data?.error ??
            err?.response?.data?.message ??
            'Something went wrong.'
        );
      }
    }
    setIsSubmitting(false);
  };
  return (
    <Modal
      isOpen={props.status}
      // isOpen={utilVal.isCreditLineCreationModalOpen}
      onClose={() => props.setStatus(false)}
      isCentered
    >
      <Box pl="20rem">
        <ModalOverlay backdropFilter="blur(3px) hue-rotate(0deg)" />
        <ModalContent>
          <ModalBody padding="1rem 1.75rem">
            <ModalCloseButton color="#ABB0BA" />

            <Heading textAlign={'center'} fontSize={'20px'}>
              TRANSFER FUND
            </Heading>

            <Box py={'8'}>
              <Formik
                initialValues={{
                  senderWalletNumber: props?.user?.wallets?.at(0)?.account_no,
                  transferAmount: '',
                  receiverWalletNumber: '',
                }}
                onSubmit={async (values, actions) => {
                  try {
                    await handleTransfer(values);
                  } catch (err) {
                    console.log(err);
                  }
                }}
                validationSchema={yup.object().shape({
                  senderWalletNumber: yup
                    .string()
                    .matches(
                      /^\d{12}$/,
                      'Sender Wallet Number must be 12 digits'
                    )
                    .required('Sender Wallet Number is required'),

                  transferAmount: yup
                    .string()
                    .matches(
                      /^\d+(\.\d{1,2})?$/,
                      'Transfer Amount must be a valid number'
                    )
                    .required('Transfer Amount is required'),

                  receiverWalletNumber: yup
                    .string()
                    .matches(
                      /^\d{12}$/,
                      'Receiver Wallet Number must be 12 digits'
                    )
                    .required('Receiver Wallet Number is required'),
                })}
              >
                {({
                  handleSubmit,
                  errors,
                  touched,
                  values,
                  setFieldTouched,
                  setFieldValue,
                  handleChange,
                }) => (
                  <>
                    <form onSubmit={handleSubmit}>
                      <Box maxWidth="32rem" borderRadius="0.1rem">
                        <FormControl
                          flexBasis={'47.5%'}
                          sx={{
                            caretColor: 'transparent',
                          }}
                          position="relative"
                          isInvalid={
                            Boolean(errors.senderWalletNumber) &&
                            Boolean(touched?.senderWalletNumber)
                          }
                        >
                          <Text>senderWalletNumber</Text>
                          <Select
                            marginBottom="2rem"
                            placeholder="Select senderWalletNumber"
                            value={`${values?.senderWalletNumber}`}
                            onBlur={() => setFieldTouched('senderWalletNumber')}
                            onChange={(elem) => {
                              setFieldValue(
                                'senderWalletNumber',
                                elem.target.value
                              );
                            }}
                          >
                            {props?.user?.wallets?.map((elem, index) => (
                              <option
                                key={`gender-${index}`}
                                value={elem.account_no}
                              >
                                {elem.account_no}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage
                            position="absolute"
                            bottom="0.25rem"
                          >
                            {errors?.senderWalletNumber?.toString()}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          position="relative"
                          isInvalid={
                            Boolean(errors.receiverWalletNumber) &&
                            Boolean(touched?.receiverWalletNumber)
                          }
                        >
                          <Text>receiverWalletNumber</Text>
                          <Field
                            as={CustomInput}
                            placeholder="receiverWalletNumber"
                            name="receiverWalletNumber"
                            onChange={handleChange}
                            id="receiverWalletNumber"
                          />
                          <FormErrorMessage
                            position="absolute"
                            bottom="0.25rem"
                          >
                            {errors?.receiverWalletNumber?.toString()}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          position="relative"
                          isInvalid={
                            Boolean(errors.transferAmount) &&
                            Boolean(touched?.transferAmount)
                          }
                        >
                          <Text>transferAmount</Text>
                          <Field
                            as={CustomInput}
                            placeholder="transferAmount"
                            name="transferAmount"
                            type="number"
                            onChange={handleChange}
                            id="transferAmount"
                          />
                          <FormErrorMessage
                            position="absolute"
                            bottom="0.25rem"
                          >
                            {errors?.transferAmount?.toString()}
                          </FormErrorMessage>
                        </FormControl>
                        {errMsg ? (
                          <p
                            style={{ paddingBottom: '18px', color: '#E53E3E' }}
                          >
                            {errMsg}
                          </p>
                        ) : null}
                        <Button
                          type="submit"
                          mb="1rem"
                          width="100%"
                          isDisabled={isSubmitting}
                          colorScheme={'green'}
                        >
                          Transfer
                        </Button>
                      </Box>
                    </form>
                  </>
                )}
              </Formik>
            </Box>
          </ModalBody>
        </ModalContent>
      </Box>
    </Modal>
  );
};
