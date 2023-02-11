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
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
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
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  VStack,
  chakra,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  addNews,
  approveWithdrawal,
  baseurl,
  completeStatement,
  completeWithdrawal,
  createStatement,
  createWithdrawal,
  deleteNews,
  getAllNews,
  getAllStatements,
  getAllWithdrawals,
  getMarketValues,
  getSpecificFund,
  getSpecificUser,
  rejectStatement,
  rejectedWithdrawal,
  updateMarketValues,
  url,
} from "../api/apis";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import EmptyLottie from "../assets/lottie/emptyRecords.json";
import Loading from "../components/Loader";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toIndianCurrency from "../helper";
import useStore from "../store/store";

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

const Withdrawals = () => {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useStore();
  const [withdrawals, setWithdrawals] = useState([]);
  const [marketValues, setMarketValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState([]);
  const [search, setSearch] = useState("");

  const updatedUsers = useMemo(() => {
    if (search === "" || !search) return marketValues;
    return marketValues.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, marketValues]);

  const handleGetAllStatements = async () => {
    try {
      setLoading(true);
      const { data } = await getMarketValues(page, size);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

      setMarketValues(data?.data);
      setUserValues(Object.values(data?.data));
      return toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
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
  const handleUpdateValues = async (userId, fundsArrayId, value) => {
    try {
      if (!userId || !fundsArrayId || isNaN(value))
        return toast({
          title: "Error",
          description: "Invalid Amount!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      setLoading(true);
      const { data } = await updateMarketValues(userId, fundsArrayId, value);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

      handleGetAllStatements();
      return toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleWithdrawalStatusToComplete = async (id) => {
    try {
      setLoading(true);
      const { data } = await completeStatement({ id });
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      handleGetAllStatements();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
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
  const handleRejectedWithdrawal = async (id) => {
    try {
      setLoading(true);
      const { data } = await rejectStatement({ id });
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      handleGetAllStatements();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
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
  const handleAddWithdrawal = async () => {
    if (!requested || requested?.length === 0)
      return toast({
        title: "Error",
        description: "Invalid details entered!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    let error = false;
    requested.forEach((item) => {
      const { fund, dateType, date } = item;
      if (!fund || !dateType) return (error = true);
      if (dateType === "custom") {
        if (!date) return (error = true);
        if (!date.from || !date.to) return (error = true);
      }
    });
    if (error)
      return toast({
        title: "Error",
        description: "Invalid details entered!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    setLoading(true);
    try {
      const { data } = await createStatement({
        requested,
      });
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

      handleGetAllStatements();
      onClose();
      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
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
    handleGetAllStatements();
  }, [page, size]);

  if (loading) return <Loading />;

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
        py: 4,
        px: 2,
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Heading color="gray.600">Market Values</Heading>
        <Input
          w="150px"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
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
        {updatedUsers?.length === 0 && (
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            h="80vh"
          >
            <LottiePlayer
              animationData={EmptyLottie}
              autoPlay={true}
              loop={true}
              style={{ height: "60vh", width: "60vw" }}
            />
            <Heading>No Market Values Assigned!</Heading>
          </Stack>
        )}
        <Accordion defaultIndex={[0]}>
          <Stack spacing={3}>
            {updatedUsers?.map((n, idx) => (
              <AccordionItem key={n?._id}>
                <MotionBox
                  variants={listVariant}
                  px={8}
                  py={4}
                  rounded="lg"
                  shadow="lg"
                  bg={useColorModeValue("white", "gray.800")}
                  maxW="100%"
                  key={n._id}
                >
                  <AccordionButton _focus={{ border: "0px" }}>
                    <Stack
                      ml={2}
                      w="100%"
                      direction="row"
                      spacing={4}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        divider={<StackDivider />}
                      >
                        <Stack spacing={1}>
                          <Heading
                            size="md"
                            alignSelf="center"
                            color="gray.600"
                          >
                            {n?.firstName} {n?.lastName}
                          </Heading>
                          <Text size="xs" alignSelf="center" color="gray.600">
                            PAN: {n?.pan?.id}
                          </Text>
                        </Stack>

                        <Tag size="lg" colorScheme="blue">
                          Active Funds: {n?.funds?.length}
                        </Tag>
                        <Tag size="lg" colorScheme="green">
                          Total Invested:{" "}
                          {toIndianCurrency(
                            n?.funds?.reduce((a, b) => a + b?.invested, 0)
                          )}
                        </Tag>
                        <Tag size="lg" colorScheme="red">
                          Total Market Value:{" "}
                          {toIndianCurrency(
                            n?.funds?.reduce((a, b) => a + b?.marketValue, 0)
                          )}
                        </Tag>
                      </Stack>
                    </Stack>
                  </AccordionButton>
                </MotionBox>

                <AccordionPanel
                  pb={4}
                  border="2px"
                  rounded="lg"
                  borderTop={"0px"}
                  borderColor="gray.400"
                >
                  <MotionBox px={2} py={2}>
                    <Stack direction="column" spacing={3}>
                      {n?.funds?.map((req, fi) => (
                        <Stack direction="row" spacing={3} key={req?._id}>
                          <Heading
                            color="gray.600"
                            fontSize="sm"
                            alignSelf="center"
                          >
                            Fund Name: {req?.id?.name}
                          </Heading>
                          <Text
                            color="gray.400"
                            fontSize="xs"
                            alignSelf="center"
                          >
                            Invested:{" "}
                            <strong>{toIndianCurrency(req?.invested)}</strong>
                          </Text>
                          <Text
                            color="gray.400"
                            fontSize="xs"
                            alignSelf="center"
                          >
                            Active Recurring Total:{" "}
                            <strong>
                              {toIndianCurrency(req?.recurringTotal)}
                            </strong>
                          </Text>
                          <Stack direction="row" spacing={1}>
                            <Text
                              color="gray.400"
                              fontSize="xs"
                              alignSelf="center"
                            >
                              Market Value:{" "}
                            </Text>
                            <Input
                              w="170px"
                              type="number"
                              value={marketValues[idx]?.funds[fi]?.marketValue}
                              onChange={(e) => {
                                const newMarketValues = [...marketValues];
                                newMarketValues[idx].funds[fi].marketValue =
                                  +e.target.value || 0;
                                setMarketValues(newMarketValues);
                              }}
                            />
                            <IconButton
                              icon={<CheckIcon />}
                              aria-label="edit"
                              colorScheme={"blue"}
                              onClick={() =>
                                handleUpdateValues(
                                  n?._id,
                                  req?.id?._id,
                                  marketValues[idx]?.funds[fi]?.marketValue
                                )
                              }
                            />
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1} pt={4}>
                      {n?.status === "pending" && user?.isAdmin && (
                        <Button
                          alignSelf={"center"}
                          onClick={() =>
                            handleWithdrawalStatusToComplete(n?._id)
                          }
                          colorScheme="green"
                          size="sm"
                          variant="solid"
                        >
                          Complete
                        </Button>
                      )}
                      {n?.status === "pending" && user?.isAdmin && (
                        <Stack direction="row" spacing={1}>
                          {user?.isAdmin && (
                            <Button
                              onClick={() => handleRejectedWithdrawal(n?._id)}
                              colorScheme="red"
                              size="sm"
                              variant="solid"
                            >
                              Reject
                            </Button>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  </MotionBox>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Stack>
        </Accordion>
      </MotionStack>
      <Box sx={{}}>
        {withdrawals?.length > 0 && (
          <Pagination
            defaultPageSize={size}
            defaultPage={page}
            total={500}
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
        )}
      </Box>
    </Box>
  );
};

export default Withdrawals;
