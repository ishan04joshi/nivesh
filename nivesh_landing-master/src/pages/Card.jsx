import { Box, Heading, Text } from "@chakra-ui/react";

import Lottie from "react-lottie";
import React from "react";

function Card({ heading, description, image, filterType, isActive }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box
      sx={{
        transform: `translateY(${isActive ? "-10px" : "0px"})`,
      }}
      p={4}
      m={2}
      rounded="lg"
      boxShadow="lg"
      bgColor="white"
      cursor="pointer"
      onClick={() => filterType(heading)}
    >
      <Lottie
        options={{ ...defaultOptions, animationData: image }}
        height={100}
        width={100}
      />
      <Heading
        fontWeight="bold"
        fontSize="25px"
        textAlign="center"
        color="gray.700"
      >
        {heading}
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="sm">
        {description}
      </Text>
    </Box>
  );
}

export default Card;
