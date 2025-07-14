import { Box, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Pulsar = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #2B6CB0 10%, transparent 50%);
  border-radius: 50%;
  position: relative;
  margin: 2rem auto;
`;

function LoadingAnimation() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(10, 11, 26, 0.9)"
      zIndex="1000"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Pulsar
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.800"
          color="#2B6CB0"
          size="xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      </Pulsar>
    </Box>
  );
}

export default LoadingAnimation;