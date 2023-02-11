import { Button, Container, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";

import AboutLottie from "../assets/lottie/about.json";
import { FaLowVision } from "react-icons/fa";
import { GiRopeDart } from "react-icons/gi";
import { Illustration } from "../components/Illustration";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { pageTransitions } from "../utils/pageTransitions";
import { useNavigate } from "react-router-dom";

const metrics = [
  {
    label: "Founded",
    value: "2017",
  },
  {
    label: "Account Managed",
    value: "₹50 lakh+",
  },
  {
    label: "No of niveshkro fund",
    value: "20+",
  },
];

const MotionContainer = motion(Container);
export default function CallToActionWithIllustration() {
  const navigate = useNavigate();
  return (
    <MotionContainer maxW={"5xl"} variants={pageTransitions} initial="initial" animate="animate" exit="exit">
      <Stack spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
        <Stack direction="column" spacing={1}>
          <Heading textAlign="left" fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
            About us{" "}
          </Heading>
        </Stack>
        <Text color={"gray.500"} maxW={"3xl"}>
          niveshkro is a fintech company which provides PMS (portfolio management services), the combination of good quality shares, mutual funds,
          gold and bonds. Our products are designed to give benefit of the share market and other investment products to the people who are
          inexperienced or have no time to manage. Founded in 2017, headquartered in Gurgaon and are a team of finance professionals, engineers and
          designers having diverse skills and experience.
        </Text>
        <Stack spacing={16}>
          <Stack spacing={1}>
            <Stack spacing={3} direction="row">
              <GiRopeDart fontSize="2em" style={{ alignSelf: "center" }} />
              <Heading color="gray.700">Mission:</Heading>
            </Stack>
            <Text color={"gray.500"} maxW={"3xl"}>
              Our mission is to maintain the return on investment higher from the market and create products that benefit every kind of customers.
            </Text>
          </Stack>
          <Stack spacing={1}>
            <Stack spacing={3} direction="row">
              <FaLowVision fontSize="2em" style={{ alignSelf: "center" }} />
              <Heading color="gray.700">Vision:</Heading>
            </Stack>
            <Text color={"gray.500"} maxW={"3xl"}>
              Our vision is to educate people regarding investment products and make easy to understand and easy to invest platform.
            </Text>
          </Stack>
          <Stack spacing={1} direction="row" w="100%" justifyContent="space-between">
            {metrics.map((metric) => (
              <Stack spacing={3} key={metric.label}>
                <Text color="gray.700" fontSize="lg" fontWeight={800}>
                  {metric.label}
                </Text>
                <Heading color={"red.400"} maxW={"3xl"}>
                  {metric.value}
                </Heading>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack spacing={6} direction={"row"}>
          <Button rounded={"full"} px={6} colorScheme={"red"} bg={"red.400"} _hover={{ bg: "red.700" }} onClick={() => navigate("/")}>
            Get started
          </Button>
          <Button rounded={"full"} px={6} onClick={() => navigate("/contact")} variant="outline">
            Contact us
          </Button>
        </Stack>
      </Stack>
    </MotionContainer>
  );
}
