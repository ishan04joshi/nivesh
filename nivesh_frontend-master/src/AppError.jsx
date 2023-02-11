import { Box, Heading, Progress, Stack, Text } from "@chakra-ui/react";

import React from "react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ErrorComponent = () => {
  return (
    <MotionBox
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      height="100vh"
    >
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ h: "100%", w: "100%" }}
      >
        <Heading>Something Went Wrong</Heading>
        <Text>Please Refresh The Page.</Text>
      </Stack>
    </MotionBox>
  );
};

export class AppError extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError = (error) => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? <ErrorComponent /> : children;
  }
}
