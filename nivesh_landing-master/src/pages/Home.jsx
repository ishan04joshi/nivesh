import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Tag,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaDollarSign,
  FaInstagram,
  FaInstagramSquare,
  FaPeopleCarry,
} from "react-icons/fa";
import React, { lazy } from "react";
import { getAllFunds, url } from "../api";

import { AiOutlineStock } from "react-icons/ai";
import Card from "./Card";
import Funds from "./Funds";
import Hero from "../components/Hero";
import Lottie from "lottie-react";
import { MdRateReview } from "react-icons/md";
import { RiExchangeDollarFill } from "react-icons/ri";
import axios from "axios";
import cardDetails from "../constants/cards_details";
import easyToInvest from "../lotties/easyToInvest.json";
import { faq } from "../constants/faq";
import { motion } from "framer-motion";
import { pageTransitions } from "../utils/pageTransitions";
import ready_toInvest from "../lotties/readyToInvest.json";
import regularReviews from "../lotties/regularReviews.json";
import { toIndianCurrency } from "../utils";
import { useNavigate } from "react-router-dom";
import valStocks from "../lotties/valStocks.json";

const Carosuel = lazy(() => import("../components/Carosuel"));

const MotionContainer = motion(Container);

const WhyInvestorsLovesUs = () => {
  return (
    <Stack spacing={6} pt={6}>
      <Stack spacing={1}>
        <Heading
          fontSize="3xl"
          color="gray.600"
          fontWeight="extrabold"
          textAlign={"center"}
        >
          Why investors Loves Us ?
        </Heading>
        <Text fontSize="xs" color="gray.500" textAlign={"center"}>
          niveshkro funds are the combination of stocks, bonds, ETF & mutual
          funds
        </Text>
      </Stack>
      <Stack spacing={3} color="gray.600" divider={<StackDivider />}>
        <SimpleGrid columns={[1, 1, 2]} gap={2}>
          <GridItem
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
          >
            <Stack direction={["column", "column", "row"]} spacing={3}>
              <Box alignSelf="center">
                <RiExchangeDollarFill fontSize={"4em"} />
              </Box>

              <Stack spacing={1}>
                <Heading
                  noOfLines={1}
                  color={"gray.600"}
                  fontWeight={700}
                  fontSize="2xl"
                  textAlign={["center", "center", "left"]}
                >
                  READY TO INVEST PORTFOLIO
                </Heading>
                <Text
                  fontSize="sm"
                  color={"gray.500"}
                  textAlign={["center", "center", "left"]}
                >
                  Investors need not to worry about where, how & how much to
                  invest. Our professionally designed stock basket is ready to
                  invest.
                </Text>
              </Stack>
            </Stack>
          </GridItem>
          <GridItem display="flex" justifyContent={"center"}>
            <Lottie
              animationData={ready_toInvest}
              loop={true}
              autoplay={true}
              style={{ width: "200px", height: "200px" }}
            />
          </GridItem>
        </SimpleGrid>
        <SimpleGrid columns={[1, 1, 2]} gap={2}>
          <GridItem display="flex" justifyContent={"center"}>
            <Lottie
              animationData={easyToInvest}
              loop={true}
              autoplay={true}
              style={{ width: "200px", height: "200px" }}
            />
          </GridItem>
          <GridItem
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
          >
            <Stack direction={["column", "column", "row"]} spacing={3}>
              <Box alignSelf="center">
                <FaPeopleCarry fontSize={"4em"} />
              </Box>

              <Stack spacing={1}>
                <Heading
                  noOfLines={1}
                  color={"gray.600"}
                  fontWeight={700}
                  fontSize="2xl"
                  textAlign={["center", "center", "left"]}
                >
                  EASY TO INVEST
                </Heading>
                <Text
                  fontSize="sm"
                  color={"gray.500"}
                  textAlign={["center", "center", "left"]}
                >
                  niveshkro provides 3 simple steps process to invest. Simple
                  ways to follow the investment procedure.
                </Text>
              </Stack>
            </Stack>
          </GridItem>
        </SimpleGrid>
        <SimpleGrid columns={[1, 1, 2]} gap={2}>
          <GridItem
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
          >
            <Stack direction={["column", "column", "row"]} spacing={3}>
              <Box alignSelf="center">
                <MdRateReview fontSize={"4em"} />
              </Box>

              <Stack spacing={1}>
                <Heading
                  noOfLines={1}
                  color={"gray.600"}
                  fontWeight={700}
                  fontSize="2xl"
                  textAlign={["center", "center", "left"]}
                >
                  REGULARLY REVIEW & CHECK
                </Heading>
                <Text
                  fontSize="sm"
                  color={"gray.500"}
                  textAlign={["center", "center", "left"]}
                >
                  Market is volatile. Review on regular basis is necessary. Our
                  team of professionals checks regularly the performance of
                  funds.
                </Text>
              </Stack>
            </Stack>
          </GridItem>
          <GridItem display="flex" justifyContent={"center"}>
            <Lottie
              animationData={regularReviews}
              loop={true}
              autoplay={true}
              style={{ width: "200px", height: "200px" }}
            />
          </GridItem>
        </SimpleGrid>
        <SimpleGrid columns={[1, 1, 2]} gap={2}>
          <GridItem display="flex" justifyContent={"center"}>
            <Lottie
              animationData={valStocks}
              loop={true}
              autoplay={true}
              style={{ width: "200px", height: "200px" }}
            />
          </GridItem>
          <GridItem
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
          >
            <Stack direction={["column", "column", "row"]} spacing={3}>
              <Box alignSelf="center">
                <AiOutlineStock fontSize={"4em"} />
              </Box>

              <Stack spacing={1}>
                <Heading
                  noOfLines={1}
                  color={"gray.600"}
                  fontWeight={700}
                  fontSize="2xl"
                  textAlign={["center", "center", "left"]}
                >
                  VALUABLE & HIGH QUALITY STOCKS
                </Heading>
                <Text
                  fontSize="sm"
                  color={"gray.500"}
                  textAlign={["center", "center", "left"]}
                >
                  Advisors follow the simple strategies to select the Fund &
                  Stock to invest. The strategies are transparent and easy to
                  understand.
                </Text>
              </Stack>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
};

const FaqSection = () => {
  return (
    <Stack spacing={3}>
      <Heading fontSize="3xl" color="gray.700" fontWeight="extrabold">
        Why investors Loves Us ?
      </Heading>

      <Accordion>
        <SimpleGrid columns={2} spacing={6}>
          {faq.map((obj) => (
            <AccordionItem rounded="lg" boxShadow="lg" h="fit-content">
              <AccordionButton _focus={{ border: "0px" }}>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  w="100%"
                >
                  <Stack spacing={3}>
                    <Heading textAlign="left" color="gray.600" fontSize="md">
                      {obj.q}
                    </Heading>
                    <Text fontSize="xs" color="gray.500" textAlign="left">
                      {obj.short}
                    </Text>
                  </Stack>
                  <AccordionIcon />
                </Stack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Divider />
                <Text
                  fontSize="sm"
                  color="gray.600"
                  textAlign="left"
                  fontWeight={"bold"}
                  mt={2}
                >
                  {obj.detail}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </SimpleGrid>
      </Accordion>
    </Stack>
  );
};

export default function CallToActionWithVideo() {
  const [funds, setFunds] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleFetchFunds = async () => {
    try {
      setLoading(true);
      const { data } = await getAllFunds();
      setLoading(false);
      if (data.error) return;
      setFunds(data?.data);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  React.useEffect(() => {
    handleFetchFunds();
  }, []);

  const getRiskValues = (riskCategory) => {
    if (riskCategory === "LOW") {
      return {
        value: 10,
        color: "green",
      };
    }
    if (riskCategory === "MEDIUM") {
      return {
        value: 50,
        color: "orange",
      };
    }
    if (riskCategory === "HIGH") {
      return {
        value: 100,
        color: "red",
      };
    }
    return {
      value: 100,
      color: "white",
    };
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      px={4}
      pb={12}
    >
      <Stack spacing={8} maxWidth={["100%", "100%", "80%"]}>
        <Hero />
        {/* <WhyInvestorsLovesUs /> */}
        {loading ? (
          <Spinner />
        ) : (
          <Box my={6}>
            <Stack align="center" mb={8}>
              <Heading fontSize="3xl" pt={16} color="gray.600">
                Popular Funds to Invest
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Invest in businesses that you like the most
              </Text>
            </Stack>
            <Carosuel gap={32}>
              {funds?.map((f, index) => (
                <Stack
                  spacing={3}
                  key={f?._id}
                  boxShadow="lg"
                  justifyContent="space-between"
                  flexDirection="column"
                  overflow="hidden"
                  color="gray.300"
                  bg="base.d100"
                  rounded={5}
                  flex={1}
                  p={5}
                >
                  <Stack direction={"row"} spacing={3}>
                    <Image
                      src={url + "/" + f?._id + "/" + f?.fundImageFile}
                      // h="80px"
                      w="100px"
                      fallback={<FaDollarSign />}
                      alt={f?.name}
                      objectFit="contain"
                      rounded="lg"
                    />
                    <Heading fontSize={"md"} color="gray.600">
                      {f?.name}
                    </Heading>
                  </Stack>

                  <Stack direction="column" spacing={3}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Text fontSize={"sm"} color="gray.600">
                        1Yr CAGR:{" "}
                        <Heading fontSize="md">{f?.cagr?.oneYear} %</Heading>
                      </Text>
                      <Text fontSize={"sm"} color="gray.600">
                        1Yr Return:{" "}
                        <Heading fontSize="md">{f?.returns?.oneYear} %</Heading>
                      </Text>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Text fontSize={"sm"} alignSelf="center" color="gray.600">
                        Daily Change:{" "}
                        <Heading
                          sx={{
                            color:
                              Number(f?.dailyChange?.at(-1)?.y) < 0
                                ? "red.400"
                                : "green.400",
                          }}
                          fontWeight={800}
                          fontSize="md"
                        >
                          {f?.dailyChange?.at(-1)?.y} %
                        </Heading>
                      </Text>
                      <Stack spacing={0}>
                        <Text fontSize={"sm"} color="gray.600">
                          Minimum Investment
                        </Text>
                        <Heading
                          fontSize={"md"}
                          color="gray.600"
                          alignSelf="flex-end"
                        >
                          {toIndianCurrency(f?.minimumInvestment)}
                        </Heading>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                      <Text fontSize={"sm"} alignSelf="center" color="gray.600">
                        Risk:{" "}
                      </Text>
                      <Heading
                        style={{
                          color: getRiskValues(f.riskCategory).color,
                          fontWeight: 800,
                        }}
                        fontSize="md"
                        alignSelf="center"
                      >
                        {f?.riskCategory}
                      </Heading>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Text fontSize={"sm"} color="gray.600">
                        About Fund: {f?.shortDescription}
                      </Text>
                    </Stack>
                  </Stack>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/fund/" + f?._id)}
                    borderColor="gray.800"
                    color="gray.800"
                    _hover={{
                      borderColor: "blue.400",
                      color: "blue.400",
                      transform: "scale(1.05)",
                    }}
                  >
                    INVEST NOW
                  </Button>
                </Stack>
              ))}
            </Carosuel>
          </Box>
        )}

        {/* <FundsSection /> */}
        <Funds />
        <FaqSection />
        <Stack pt={6} spacing={2}>
          <Heading color="gray.600" textAlign="center" fontSize="xl">
            Have More Questions?
          </Heading>
          <Button
            alignSelf={"center"}
            w="fit-content"
            variant="outline"
            color="blue.400"
            onClick={() => navigate("/contact")}
          >
            CONTACT US
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
