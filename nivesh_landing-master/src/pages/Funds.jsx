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
import React, { useEffect } from "react";

import { BiRightArrow } from "react-icons/bi";
import Card from "./Card";
import Loader from "../components/Loader";
import Lottie from "lottie-react";
import { MdCall } from "react-icons/md";
import { StarIcon } from "@chakra-ui/icons";
import card_details from "../constants/cards_details";
import { getAllFunds } from "../api";
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
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  console.log({ riskFilter, termFilter });

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
      setLoading(true);
      const { data } = await getAllFunds(page, size);
      setLoading(false);
      if (data.status) {
        setFunds(data.data);
      }
    } catch (e) {
      setLoading(false);
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
  if (loading)
    return (
      <Box>
        <Loader />
      </Box>
    );
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
          <Heading fontSize="3xl" pt={16} color="gray.600">
            niveshkro Funds
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Choose your fund as you want.
          </Text>
        </Stack>
        <Box>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {card_details.map((obj, i) => {
              return (
                <Card
                  isActive={riskFilter === obj.heading.toLowerCase()}
                  key={obj?.heading}
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
        {}
      </Stack>
    </Box>
  );
};

export default Cpwe;
