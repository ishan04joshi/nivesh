import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  chakra,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useMemo, useState } from "react";
import {
  completeSRequest,
  getSpecificUser,
  getSupportRequests,
  getUsers,
  updatePendingUserToApproved,
  updatePendingUserToRejected,
  updateUserToBlocked,
  updateUserToUnblocked,
  url,
} from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";

import { BsArrowUpRight } from "react-icons/bs";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
import { FaStar } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import { TiTickOutline } from "react-icons/ti";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const MotionStack = motion(Stack);
const MotionBox = motion(Box);

const boxVariants = {
  hidden: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.4,
    },
  },
};

const listVariant = {
  hidden: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const AllUsers = () => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const filteredRequests = useMemo(() => {
    switch (filter) {
      case "all":
        return requests;
      case "pending":
        return requests.filter((request) => request.status === "pending");
      case "completed":
        return requests.filter((request) => request.status === "completed");
      default:
        return requests;
    }
  }, [filter, requests]);

  const handleGetAllSupportRequests = async () => {
    try {
      const { data } = await getSupportRequests(page, size);
      if (data.error)
        return toast({
          title: "Error",
          status: "error",
          message: data.message,
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      if (data.status) {
        setRequests(data.data);
        return toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
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

  const handleCompleteRequest = async (id) => {
    try {
      if (!id) return;
      const { data } = await completeSRequest(id);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      handleGetAllSupportRequests();
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    handleGetAllSupportRequests();
  }, [page, size]);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
        // justifyContent: "center",
        // bg: "red",
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Heading color="gray.600">
          Support Requests: {filteredRequests.length}
        </Heading>
      </Stack>
      <MotionStack
        variants={boxVariants}
        initial="hidden"
        animate="animate"
        direction="column"
        spacing={2}
        sx={{
          px: {
            sm: 2,
            lg: 6,
          },
          pt: 4,
        }}
      >
        {filteredRequests.length === 0 && (
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
            <Heading>No Requests Found</Heading>
          </Stack>
        )}
        <Accordion defaultIndex={[0]}>
          <Stack spacing={5}>
            {filteredRequests?.map((r) => (
              <AccordionItem rounded="lg" boxShadow="lg" bg="white">
                <AccordionButton _focus={{ border: "0px" }}>
                  <Stack
                    direction="row"
                    justifyContent={"space-between"}
                    w="100%"
                  >
                    <Stack spacing={2}>
                      <Badge w="fit-content" colorScheme={"blue"}>
                        {r.status}
                      </Badge>
                      <Heading textAlign="left" color="gray.600" fontSize="md">
                        {r.message.substring(0, 50)}...
                      </Heading>
                      <Stack spacing={1}>
                        <Text fontSize="xs" color="gray.500" textAlign="left">
                          Queried By: <strong>{r.name}</strong>
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="left">
                          Email: <strong>{r.email}</strong>
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="left">
                          Phone: <strong>{r.phone}</strong>
                        </Text>
                      </Stack>
                    </Stack>
                    <AccordionIcon />
                  </Stack>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Divider />
                  <Stack spacing={1}>
                    <Text
                      fontSize="md"
                      color="gray.600"
                      textAlign="left"
                      fontWeight={"bold"}
                      mt={2}
                    >
                      {r.message}
                    </Text>
                    {r.status !== "completed" && (
                      <Button
                        w="fit-content"
                        colorScheme={"blue"}
                        size="sm"
                        alignSelf="flex-end"
                        onClick={() => handleCompleteRequest(r._id)}
                      >
                        MARK COMPLETE
                      </Button>
                    )}
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Stack>
        </Accordion>
      </MotionStack>
      <Box sx={{}}>
        {filteredRequests.length >= size || page > 1 ? (
          <Pagination
            defaultPageSize={size}
            defaultPage={page}
            total={1000000}
            paginationProps={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2em",
            }}
            pageNeighbours={1}
            showQuickJumper
            responsive
            onChange={(page) => setPage(page)}
            onShowSizeChange={(size, e) => setSize(parseInt(e))}
            showSizeChanger
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default AllUsers;
