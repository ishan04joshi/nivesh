import { Heading, Stack } from "@chakra-ui/react";

import EmptyLottie from "../assets/lottie/emptyRecords.json";
import LottiePlayer from "lottie-react";
import { memo } from "react";

function Empty() {
  return (
    <Stack
      direction="column"
      spacing={3}
      justifyContent="center"
      alignItems="center"
      h="80vh"
      // bg="red"
    >
      <LottiePlayer
        animationData={EmptyLottie}
        autoPlay={true}
        loop={true}
        style={{ height: "60vh", width: "60vw" }}
      />
      <Heading>No Subscribers Found!</Heading>
    </Stack>
  );
}

export default memo(Empty);
