import { Box, Heading, Progress, Stack } from "@chakra-ui/react";

import LoadingAnimation from "../assets/lottie/loading.json";
import Lottie from "lottie-react";
import React from "react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Loader = () => {
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
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ h: "100%", w: "100%" }}
      >
        <Heading fontSize="4xl">Niveshkro.com</Heading>
        <Heading fontSize="xl">Loading...</Heading>
        <Lottie
          animationData={LoadingAnimation}
          autoplay
          loop
          style={{ height: "30vh", width: "40vw" }}
        />
      </Stack>
    </MotionBox>
  );
};

export default Loader;
