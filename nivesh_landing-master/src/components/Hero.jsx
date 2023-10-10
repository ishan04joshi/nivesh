import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Stack,
  StackDivider,
  Text,
  createIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Typewriter, useTypewriter } from "react-simple-typewriter";

import { BiScan } from "react-icons/bi";
import { FaPeopleArrows } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import MovingText from "react-moving-text";
import { PORTAL_URL } from "../constants";
import homehero from "../lotties/homehero.json";
import { useNavigate } from "react-router-dom";

export default function CallToActionWithVideo() {
  const navigate = useNavigate();
  const [text, helper] = useTypewriter({
    loop: true,
    typeSpeed: 50,
    deleteSpeed: 10,
    cursor: true,
    cursorBlinking: true,
    words: [
      "Diversified",
      "Goal Oriented",
      "Regularly Managed",
      "Easy to Invest",
    ],
  });

  return (
    <Container maxW={"7xl"} pt={8}>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 4, md: 8 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 8 }}>
          <Heading
            color="gray.800"
            fontSize={{
              base: "3xl",
              sm: "4xl",
              md: "5xl",
              lg: "6xl",
            }}
            lineHeight={0.9}
          >
            We provide{" "}
          </Heading>
          <Heading lineHeight={1.1} fontWeight={600} fontSize="4xl">
            <br />
            {/* <Text as={"span"} color={"red.400"}>
              We provide{" "}
            </Text> */}
            professionally managed portfolio for investment
          </Heading>
          <Box>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize="4xl"
              color="red.400"
            >
              {text}
            </Heading>
          </Box>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"red"}
              bg={"red.400"}
              _hover={{ bg: "red.500" }}
              onClick={() => window.open(PORTAL_URL)}
            >
              Get started
            </Button>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Box
            position={"relative"}
            rounded={"2xl"}
            width={"full"}
            overflow={"hidden"}
          >
            <Lottie
              animationData={homehero}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}

const PlayIcon = createIcon({
  displayName: "PlayIcon",
  viewBox: "0 0 58 58",
  d: "M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z",
});
