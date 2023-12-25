import React from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  Button as CharkaButton,
} from '@chakra-ui/react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

export const Button = (props: any) => {
  return (
    <CharkaButton
      color="white"
      fontSize="1rem"
      fontWeight="700"
      paddingY="1.5rem"
      bg="green.500"
      // _disabled={{
      //   bg: '#789fbe',
      // }}
      sx={{
        '&:hover': {
          bg: 'green.600',
        },
        '&:disabled': {
          bg: 'gray',
        },
      }}
      {...props}
    />
  );
};

export const InvertedButton = (props: any) => {
  return (
    <CharkaButton
      fontWeight="700"
      color="#38910F"
      border="1px solid #E5E5E5"
      borderRadius="0.25rem"
      fontSize="1rem"
      paddingY="1.5rem"
      bg="white"
      sx={{
        '&:hover': {
          bg: '#38910F',
          color: 'white',
        },
      }}
      {...props}
    />
  );
};

export const PasswordInput = (props: any) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md" justifyContent="center" alignItems="center">
      <Input
        type={show ? 'text' : 'password'}
        padding="1.5rem 1rem"
        borderColor="#EFF0F2"
        marginBottom="2rem"
        placeholder="password"
        sx={{
          '&:hover': {
            borderColor: '38910F',
            outlineColor: '38910F',
            caretColor: 'black',
          },
        }}
        {...props}
      />
      <InputRightElement height="3rem" onClick={handleClick}>
        {show ? (
          <AiFillEyeInvisible onClick={handleClick} />
        ) : (
          <AiFillEye onClick={handleClick} />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

export const CustomInput = (props: any) => {
  return (
    <Input
      padding="1.5rem 1rem"
      borderColor="#EFF0F2"
      marginBottom="2rem"
      placeholder={'Username'}
      _disabled={{
        opacity: 0.5,
        cursor: 'not-allowed',
        border: '2px solid black',
      }}
      sx={{
        '&:hover': {
          borderColor: '38910F',
          outlineColor: '38910F',
          caretColor: 'black',
        },
        '&:disabled': {
          opacity: '0.55',
          borderColor: '#EFF0F2', // Set the border color for disabled state
        },
      }}
      {...props}
    />
  );
};
