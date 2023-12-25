'use client';

import {
  Flex,
  Box,
  FormErrorMessage,
  Text,
  Button,
  Image,
  FormControl,
  useMediaQuery,
  Link,
  Select,
} from '@chakra-ui/react';
import { AuthLayout } from '@/components/AuthLayout';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { login, register } from '@/shared/api';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { CustomInput, PasswordInput } from '@/components/FormComponents';

export default function Home() {
  const router = useRouter();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const isAuthenticated = useStoreState(
    (state: any) => state.user.isAuthenticated
  );

  const [errMsg, setErrMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useLayoutEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, []);

  const saveLoggedInUser = useStoreActions(
    (actions: any) => actions?.user?.saveLoginData
  );
  const setIsAuthenticated = useStoreActions(
    (actions: any) => actions?.user?.setIsAuthenticated
  );

  const handleRegister = async (val: any) => {
    try {
      setIsSubmitting(true);
      let response = await register(val);
      if (response?.statusCode === 200) {
        router.replace('/login');
      } else {
        setErrMsg(response?.error.message ?? response?.error);
      }
    } catch (err: any) {
      setErrMsg(
        err?.response?.data?.error.message ??
          err?.response?.data?.error ??
          err.message ??
          'Something went wrong.'
      );
    }
    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      <Flex
        justifyContent="space-between"
        justify="start"
        padding="0.5rem 1rem 0.5rem 1rem"
        borderBottom="2px solid #EFF0F2"
        fontSize="0.9rem"
      >
        <Image
          src={
            'https://chamsmobile.com/wp-content/uploads/2020/01/chams-main-logo.png'
          }
          w="6rem"
          h="3.25rem"
          objectFit={'cover'}
        />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="center"
        height="calc(100vh - 130px)"
        alignItems="center"
        overflowX={'scroll'}
        sx={
          isLargerThan800
            ? {}
            : {
                minHeight: '500px',
              }
        }
      >
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            middleName: '',
            bvnDetails: {
              bvn: '',
              bvnDateOfBirth: '',
            },
            phoneNumber: '',
            gender: '',
            customerEmail: '',
            password: '',
            ConfirmPassword: '',
          }}
          onSubmit={(values, actions) => {
            try {
              const { ConfirmPassword, ...rest } = values;
              handleRegister({
                ...rest,
              });
            } catch (err) {
              console.log(err);
            }
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string()
              .required()
              .transform((value) => value.toLowerCase()),
            middleName: Yup.string()
              .required()
              .transform((value) => value.toLowerCase()),
            lastName: Yup.string()
              .required()
              .transform((value) => value.toLowerCase()),
            bvnDetails: Yup.object()
              .shape({
                bvn: Yup.string()
                  .matches(/^\d{11}$/, 'BVN must be 11 digits')
                  .required(),
                bvnDateOfBirth: Yup.date().required(),
              })
              .required(),
            customerEmail: Yup.string()
              .email()
              .required()
              .transform((value) => value.toLowerCase()),
            phoneNumber: Yup.string()
              .matches(
                /^\+\d{13}$/,
                'Phone number must be in the format +234xxxxxxxxxx'
              )
              .required(),
            gender: Yup.mixed().oneOf(['male', 'female']).required(),
            password: Yup.string().required('Required').min(5, 'Too short'),
            ConfirmPassword: Yup.string()
              .oneOf([Yup.ref('password')], 'Password Must Match')
              .required('Required'),
          })}
        >
          {({
            handleSubmit,
            errors,
            touched,
            handleChange,
            values,
            setFieldTouched,
            setFieldValue,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <Box maxWidth="32rem" borderRadius="0.1rem">
                  <Text
                    pt="10rem"
                    fontWeight="700"
                    color="black"
                    fontSize="1.5rem"
                    lineHeight="2rem"
                  >
                    Register
                  </Text>
                  <Text
                    color="#ABB0BA"
                    fontSize="0.9rem"
                    lineHeight="1.25rem"
                    mb="3.25rem"
                    mt="0.5rem"
                  >
                    Kindly Register
                  </Text>
                  <Flex gap={'0.4rem'}>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.firstName) && Boolean(touched?.firstName)
                      }
                    >
                      <Field
                        as={CustomInput}
                        placeholder="firstName"
                        name="firstName"
                        onChange={handleChange}
                        id="firstName"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.firstName?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.lastName) && Boolean(touched?.lastName)
                      }
                    >
                      <Field
                        as={CustomInput}
                        placeholder="lastName"
                        name="lastName"
                        onChange={handleChange}
                        id="lastName"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.lastName?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex gap={'0.4rem'}>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.middleName) &&
                        Boolean(touched?.middleName)
                      }
                    >
                      <Field
                        as={CustomInput}
                        placeholder="middleName"
                        name="middleName"
                        onChange={handleChange}
                        id="middleName"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.middleName?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.customerEmail) &&
                        Boolean(touched?.customerEmail)
                      }
                    >
                      <Field
                        as={CustomInput}
                        placeholder="customerEmail"
                        name="customerEmail"
                        onChange={handleChange}
                        id="customerEmail"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.customerEmail?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex gap={'0.5rem'}>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.bvnDetails?.bvn) &&
                        Boolean(touched?.bvnDetails?.bvn)
                      }
                    >
                      <Text pl="0.5rem">BVN</Text>
                      <Field
                        as={CustomInput}
                        placeholder="BVN"
                        name="bvnDetails.bvn"
                        onChange={handleChange}
                        id="bvnDetails.bvn"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.bvnDetails?.bvn?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.bvnDetails?.bvnDateOfBirth) &&
                        Boolean(touched?.bvnDetails?.bvnDateOfBirth)
                      }
                    >
                      <Text pl="0.5rem">DOB</Text>
                      <Field
                        as={CustomInput}
                        type={'date'}
                        placeholder="Date Of Birth"
                        name="bvnDetails.bvnDateOfBirth"
                        onChange={handleChange}
                        id="bvnDetails.bvnDateOfBirth"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.bvnDetails?.bvnDateOfBirth?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex gap="0.4rem">
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.phoneNumber) &&
                        Boolean(touched?.phoneNumber)
                      }
                    >
                      <Field
                        as={CustomInput}
                        placeholder="phoneNumber"
                        name="phoneNumber"
                        onChange={handleChange}
                        id="phoneNumber"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.phoneNumber?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      flexBasis={'47.5%'}
                      sx={{
                        caretColor: 'transparent',
                      }}
                      position="relative"
                      isInvalid={
                        Boolean(errors.gender) && Boolean(touched?.gender)
                      }
                    >
                      <Select
                        marginBottom="2rem"
                        placeholder="Select Gender"
                        value={`${values?.gender}`}
                        onBlur={() => setFieldTouched('gender')}
                        onChange={(elem) => {
                          setFieldValue('gender', elem.target.value);
                        }}
                      >
                        <option value={'male'}>male</option>
                        <option value={'male'}>female</option>
                      </Select>
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.gender?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex gap="0.4rem">
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.password) && Boolean(touched?.password)
                      }
                    >
                      <Field
                        as={PasswordInput}
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        id="password"
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.password?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      position="relative"
                      isInvalid={
                        Boolean(errors.ConfirmPassword) &&
                        Boolean(touched?.ConfirmPassword)
                      }
                    >
                      <Field
                        as={PasswordInput}
                        placeholder="Confirm password"
                        name="ConfirmPassword"
                        id="ConfirmPassword"
                        onChange={handleChange}
                      />
                      <FormErrorMessage position="absolute" bottom="0.25rem">
                        {errors?.ConfirmPassword?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>

                  {errMsg ? (
                    <p style={{ paddingBottom: '18px', color: '#E53E3E' }}>
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
                    Register
                  </Button>
                  <Flex gap="0.5rem">
                    <Text>I have an Account</Text>
                    <Link href="\register" color="green.500">
                      Sign Up ?
                    </Link>
                  </Flex>
                </Box>
              </form>
            </>
          )}
        </Formik>
      </Flex>
    </AuthLayout>
  );
}
