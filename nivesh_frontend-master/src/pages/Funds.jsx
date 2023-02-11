import {
  Badge,
  Box,
  Divider,
  Flex,
  GridItem,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useEffect } from "react";

import { BiRightArrow } from "react-icons/bi";
import Card from "../components/Card";
import Lottie from "lottie-react";
import { MdCall } from "react-icons/md";
import { StarIcon } from "@chakra-ui/icons";
import card_details from "../constants/cards_details";
import { getAllFunds } from "../api/apis";
import high_risk from "../lotties/high_risk.json";
import medium_term from "../lotties/medium_term.json";
import { motion } from "framer-motion";
import risk_free from "../lotties/risk_free.json";
import short_term from "../lotties/short_term.json";
import term_details from "../constants/term_details";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MotionBox = motion(Box);

const Cpwe = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [funds, setFunds] = useState([]);
  const navigate = useNavigate();
  const [riskFilter, setRiskFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const toast = useToast();
  const handleFilterTypeRisk = (type) => {
    if (riskFilter === type.toLowerCase()) {
      return setRiskFilter("");
    }
    setRiskFilter(type.toLowerCase());
  };
  const handleFilterTypeTenure = (type) => {
    if (termFilter === type.toLowerCase()) {
      return setTermFilter("");
    }
    setTermFilter(type.toLowerCase());
  };
  const handleGetAllFunds = async () => {
    try {
      const { data } = await getAllFunds(page, size);
      if (data.status) {
        setFunds(data.data);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    handleGetAllFunds();
  }, [page, size]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      px={4}
      pb={12}
    >
      <Stack spacing={8} maxWidth={["100%", "100%", "80%"]}>
        <Stack align="center">
          <Heading fontSize="3xl" pt={16}>
            Niveshkro Funds
          </Heading>
          <Text>
            Invest in best funds recommended by niveshkro
            <br />
            that are selected that best suit your needs.
          </Text>
        </Stack>
        <Box>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {card_details.map((obj, i) => {
              return (
                <Card
                  isActive={riskFilter === obj.heading.toLowerCase()}
                  key={i}
                  filterType={(ft) => handleFilterTypeRisk(ft)}
                  heading={obj.heading}
                  description={obj.description}
                  image={obj.image}
                />
              );
            })}
          </SimpleGrid>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {term_details.map((obj, i) => {
              return (
                <Card
                  isActive={termFilter === obj.heading.toLowerCase()}
                  key={i}
                  filterType={(ft) => handleFilterTypeTenure(ft)}
                  heading={obj.heading}
                  description={obj.description}
                  image={obj.image}
                />
              );
            })}
          </SimpleGrid>
        </Box>
        <Stack spacing={5}>
          <Heading fontSize="3xl" color="gray.700" fontWeight="extrabold">
            Percentage base
          </Heading>
          <TableContainer rounded={"lg"} border="1px" borderColor="gray.400">
            <Table colorScheme={'blue'}>
              <Thead>
                <Tr>
                  <Th>Percentage base</Th>
                  <Th></Th>
                  <Th>Daily change</Th>
                  <Th>1Y CAGR</Th>
                  <Th>3Y CAGR</Th>
                </Tr>
              </Thead>
              <Tbody>
                {funds.map((fund, i) => {
                  return (
                    <Tr
                      key={i}
                      sx={{
                        bg: () => {
                          if (riskFilter && termFilter) {
                            if (
                              riskFilter?.includes(
                                fund?.riskCategory?.toLowerCase()
                              ) &&
                              termFilter.includes(fund?.duration?.toLowerCase())
                            ) {
                              return "white";
                            }
                          }
                          if (riskFilter && !termFilter) {
                            if (
                              riskFilter?.includes(
                                fund?.riskCategory?.toLowerCase()
                              )
                            ) {
                              return "white";
                            }
                          }
                          if (termFilter && !riskFilter) {
                            if (
                              termFilter?.includes(
                                fund?.duration?.toLowerCase()
                              )
                            ) {
                              console.log("3");
                              return "white";
                            }
                          }
                          return "transparent";
                        },
                      }}
                      _hover={{
                        bg: "gray.200",
                        transition: "all 0.2s ease-in-out",
                        rounded: "lg",
                      }}
                      cursor="pointer"
                      onClick={() => navigate("/fund/" + fund?._id)}
                    >
                      <Td>
                        {Number(fund?.returns?.oneYear) > 20 &&
                          "Fund Return more than 20%"}
                        {Number(fund?.returns?.oneYear) > 10 &&
                          Number(fund?.returns?.oneYear) <= 20 &&
                          "Fund Return under 10 to 20%"}
                        {Number(fund?.returns?.oneYear) < 10 &&
                          "Fund Return under 10%"}
                      </Td>
                      <Td>
                        <Text fontWeight={700} noOfLines={1}>
                          {fund?.name}
                        </Text>
                      </Td>
                      <Td>
                        <Text
                          fontWeight={700}
                          noOfLines={1}
                          color={
                            Number(fund?.dailyChange?.at(-1)?.y) < 0 &&
                            "red.400"
                          }
                        >
                          {fund?.dailyChange?.at(-1)?.y}%
                        </Text>
                      </Td>
                      <Td>
                        <Text fontWeight={700} noOfLines={1}>
                          {fund?.cagr?.oneYear}%
                        </Text>
                      </Td>
                      <Td>
                        <Text fontWeight={700} noOfLines={1}>
                          {fund?.cagr?.threeYears}%
                        </Text>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(Cpwe);
