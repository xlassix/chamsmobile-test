import { Spinner, Box, Center } from '@chakra-ui/react';

function LoadingComponent() {
  return (
    <Center h="100vh" w="100vw" bg="green.500">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="white"
        size="xl"
      />
    </Center>
  );
}

export default LoadingComponent;
