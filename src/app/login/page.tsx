'use client';

import {
  Flex,
  Box,
  FormErrorMessage,
  Text,
  Button,
  Image,
  HStack,
  FormControl,
  useMediaQuery,
  Link,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AuthLayout } from '@/components/AuthLayout';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { login } from '@/shared/api';
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

  const handleLogin = async (val: any) => {
    try {
      setIsSubmitting(true);
      let response = await login(val);
      if (response?.statusCode === 200) {
        sessionStorage.setItem('token', response?.token);
        saveLoggedInUser(response?.user);
        setIsAuthenticated(true);
        router.replace('/');
      } else {
        setErrMsg('wrong credentials');
      }
    } catch (err) {
      setErrMsg('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
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
        sx={
          isLargerThan800
            ? {}
            : {
                minHeight: '500px',
              }
        }
      >
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, actions) => {
            try {
              handleLogin({
                userIdentifier: values.username,
                password: values.password,
              });
            } catch (err) {
              console.log(err);
            }
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Required').min(5, 'Too short'),
            password: Yup.string().required('Required').min(5, 'Too short'),
          })}
        >
          {({ handleSubmit, errors, touched, values }) => (
            <>
              <form onSubmit={handleSubmit}>
                <Box maxWidth="32rem" borderRadius="0.1rem">
                  <Text
                    fontWeight="700"
                    color="black"
                    fontSize="1.5rem"
                    lineHeight="2rem"
                  >
                    Login
                  </Text>
                  <Text
                    color="#ABB0BA"
                    fontSize="0.9rem"
                    lineHeight="1.25rem"
                    mb="3.25rem"
                    mt="0.5rem"
                  >
                    Kindly Login
                  </Text>
                  <FormControl
                    sx={{
                      caretColor: 'transparent',
                    }}
                    position="relative"
                    isInvalid={
                      Boolean(errors.username) && Boolean(touched?.username)
                    }
                  >
                    <Field
                      as={CustomInput}
                      name="username"
                      id="username"
                      placeholder={'username'}
                    />
                    <FormErrorMessage position="absolute" bottom="0.25rem">
                      {errors?.username?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    sx={{
                      caretColor: 'transparent',
                    }}
                    position="relative"
                    isInvalid={
                      Boolean(errors.password) && Boolean(touched?.password)
                    }
                  >
                    <Field
                      as={PasswordInput}
                      name="password"
                      id="password"
                      placeholder={'password'}
                    />
                    <FormErrorMessage position="absolute" bottom="0.25rem">
                      {errors?.password?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                  {errMsg ? (
                    <p style={{ paddingBottom: '18px', color: '#E53E3E' }}>
                      {errMsg}
                    </p>
                  ) : null}
                  {/* <Flex
                      alignItems="center"
                      fontSize="0.8rem"
                      gap="0.2rem"
                      marginBottom="1rem"
                      flexFlow="row wrap"
                    >
                      <Field
                        as={Checkbox}
                        size="lg"
                        name="isChecked"
                        id="isChecked"
                        colorScheme="green"
                        value={values.isChecked}
                        defaultChecked
                      />
                      <Text marginLeft={'0.5rem'}>{t('terms.prefix')} </Text>
                      <Link
                        textDecorationLine={'underline'}
                        _hover={{ color: 'blue' }}
                        onClick={() => setPolicyVisibility(true)}
                      >
                        {t('terms.privacy')}{' '}
                      </Link>{' '}
                      <Text> {t('and')} </Text>
                      <Link
                        textDecorationLine={'underline'}
                        _hover={{ color: 'blue' }}
                      >
                        {t('terms.terms')}
                      </Link>
                    </Flex> */}
                  <Button
                    type="submit"
                    mb="1rem"
                    width="100%"
                    isDisabled={isSubmitting}
                    colorScheme={'green'}
                  >
                    Login
                  </Button>
                  <Flex gap="0.5rem">
                    <Text>Don&apos;t have an Account?</Text>
                    <Link href="\register" color="green.500">
                      Register here
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
