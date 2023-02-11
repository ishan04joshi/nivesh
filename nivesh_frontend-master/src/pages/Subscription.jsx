import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
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
  Table,
  TableContainer,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  chakra,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useMemo, useState } from "react";
import { TiTick, TiTickOutline } from "react-icons/ti";
import {
  cancelSubscription,
  fetchUser,
  getAllFunds,
  getAllSubscriptions,
  getSpecificUser,
  getUsers,
  newFund,
  pauseSubscription,
  resumeSubscription,
  syncSubscription,
  updateUserToBlocked,
  updateUserToUnblocked,
  url,
} from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";

import { BsArrowUpRight } from "react-icons/bs";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
import { HiDotsHorizontal } from "react-icons/hi";
import Loader from "../components/Loader";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import ScrollModal from "../components/ScrollModal";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
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

const SubscriptionManager = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [funds, setFunds] = useState([]);
  const [specificUserId, setSpecificUserId] = useState(null);
  const [specificUserDetails, setSpecificUserDetails] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mode, setMode] = useState("update");
  const [riskCategory, setRiskCategory] = useState("HIGH");
  const [shares, setShares] = useState([]);
  const [duration, setDuration] = useState("SHORT");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const dailyChangeRef = React.useRef(null);
  const fundGraphRef = React.useRef(null);
  const [dailyChangeFile, setDailyChangeFile] = useState(null);
  const [fundGraphFile, setFundGraphFile] = useState(null);
  const [fundName, setFundName] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [fundShortDescription, setFundShortDescription] = useState("");
  const [fundMinimumInvestment, setFundMinimumInvestment] = useState(0);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionsToShow, setTransactionsToShow] = useState(null);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const handleGetAllSubscriptions = async () => {
    try {
      setLoading(true);
      const { data } = await getAllSubscriptions(page, size);
      setLoading(false);
      setFetched(true);
      const { data: userData } = await fetchUser();
      if (data?.error || userData?.error)
        return toast({
          title: "Error",
          description: data?.message || userData?.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setFunds(userData?.data?.funds);
      setUserSubscriptions(data?.data || []);
      setTotalPages(data?.count || 0);
      return toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setFetched(true);
      setLoading(false);
      console.log(e);
      toast({
        title: "Error",
        description: e?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  const handlePauseSubscription = async (id) => {
    try {
      setLoading(true);
      const { data } = await pauseSubscription(id);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      handleGetAllSubscriptions();
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
        description: e?.response?.data?.message || "Internal Server Error!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleResumeSubscription = async (id) => {
    try {
      setLoading(true);
      const { data } = await resumeSubscription(id);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      handleGetAllSubscriptions();
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
        description: e?.response?.data?.message || "Internal Server Error!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleSyncSubscription = async (id) => {
    try {
      setLoading(true);
      const { data } = await syncSubscription(id);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      handleGetAllSubscriptions();
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
        description: e?.response?.data?.message || "Internal Server Error!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleCancelSubscription = async (id) => {
    try {
      setLoading(true);
      const { data } = await cancelSubscription(id);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      handleGetAllSubscriptions();
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
        description: e?.response?.data?.message || "Internal Server Error!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const userSubscriptionsFiltered = useMemo(() => {
    if (!user.isAdmin) return userSubscriptions;
    return userSubscriptions.filter((subscription) => {
      if (!search) return true;
      return (
        subscription?.user?.firstName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        subscription?.user?.lastName
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, userSubscriptions]);
  useEffect(() => {
    handleGetAllSubscriptions();
  }, [page, size]);

  if (loading)
    return (
      <Box>
        <Loader />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Heading color="gray.600">Subscriptions</Heading>
        {user?.isAdmin && (
          <Input
            w="200px"
            placeholder="Search By Name.."
            onChange={(e) => setSearch(e.target.value)}
            focusBorderColor="blue.500"
            variant={"filled"}
            bg="white"
          />
        )}
      </Stack>
      {user?.isAdmin && (
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
          {userSubscriptionsFiltered?.length === 0 && (
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
              <Heading>No Subscriptions Found</Heading>
            </Stack>
          )}
          {userSubscriptionsFiltered?.length > 0 && (
            <>
              {userSubscriptionsFiltered?.map((s) => (
                <Box
                  border="1px"
                  rounded="lg"
                  p={4}
                  borderColor="gray.300"
                  key={s?._id}
                >
                  <Stack direction="row" spacing={2} py={4}>
                    <Text fontSize="sm" color="gray.600" fontWeight={"bold"}>
                      Name: {s?.user?.firstName} {s?.user?.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight={"bold"}>
                      Mobile: {s?.user?.phone}
                    </Text>
                  </Stack>
                  {s?.subscriptions?.map((fund, idx) => (
                    <MotionBox
                      variants={listVariant}
                      px={8}
                      py={4}
                      rounded="lg"
                      shadow="lg"
                      bg={useColorModeValue("white", "gray.800")}
                      maxW="100%"
                      key={fund?._id}
                    >
                      <Tag
                        size="md"
                        variant="solid"
                        px={3}
                        // py={1}
                        bg={fund.trending ? "green.900" : "red.900"}
                        color="gray.100"
                        fontSize="sm"
                        fontWeight="700"
                        rounded="md"
                        // _hover={{ bg: "gray.500" }}
                      >
                        {fund.status}
                      </Tag>

                      <Stack
                        direction="row"
                        spacing={2}
                        mt={2}
                        divider={<StackDivider />}
                        justifyContent="space-evenly"
                      >
                        <Stack direction="column" spacing={1}>
                          <Heading fontSize="md">Paid Amount</Heading>
                          <Heading fontSize="sm">
                            {toIndianCurrency(fund?.paidCounts * fund?.amount)}
                          </Heading>
                        </Stack>
                        <Stack direction="column" spacing={1}>
                          <Heading fontSize="md">Remaining Amount</Heading>

                          <Tag size="sm" colorScheme="green" variant="subtle">
                            {toIndianCurrency(
                              fund?.remainingCounts * fund?.amount
                            )}
                          </Tag>
                        </Stack>
                        <Stack direction="column" spacing={1}>
                          <Heading fontSize="md">Transactions: </Heading>
                          <Button
                            size="xs"
                            onClick={() => {
                              setTransactionsToShow(fund?.transactions);
                              setShowTransactions(true);
                            }}
                          >
                            Show Details
                          </Button>
                        </Stack>
                        <Stack direction="column" spacing={1}>
                          <Heading fontSize="md">
                            FUND
                            <br />
                            {fund?.fund?.name.substring(0, 20)}
                          </Heading>

                          <Tag
                            size="sm"
                            colorScheme={
                              (fund.riskCategory === "HIGH" && "red") ||
                              (fund.riskCategory === "MEDIUM" && "yellow") ||
                              (fund.riskCategory === "LOW" && "green")
                            }
                          >
                            {fund?.riskCategory}
                          </Tag>
                        </Stack>
                      </Stack>

                      <Flex
                        justifyContent="space-around"
                        alignItems="center"
                        mt={4}
                        //   sx={{ w: "100%", bg: "red" }}
                      >
                        <Text
                          fontSize="sm"
                          noOfLines={0}
                          color={useColorModeValue("gray.600", "gray.400")}
                        >
                          Created:{" "}
                          {dayjs(fund?.createdAt).format("dddd, DD MMMM YYYY")}
                        </Text>
                        <Text
                          fontSize="sm"
                          noOfLines={0}
                          color={useColorModeValue("gray.600", "gray.400")}
                        >
                          End Date:{" "}
                          {dayjs(fund?.endDate).format("dddd, DD MMMM YYYY")}
                        </Text>
                      </Flex>
                    </MotionBox>
                  ))}
                </Box>
              ))}
            </>
          )}
        </MotionStack>
      )}
      {!user?.isAdmin && (
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
          {userSubscriptionsFiltered?.subscriptions?.length === 0 && (
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
              <Heading>No Subscriptions Found</Heading>
            </Stack>
          )}
          {userSubscriptionsFiltered?.subscriptions?.map((fund, idx) => (
            <MotionBox
              variants={listVariant}
              px={8}
              py={4}
              rounded="lg"
              shadow="lg"
              bg={useColorModeValue("white", "gray.800")}
              maxW="100%"
              key={fund?._id}
            >
              <Tag
                size="md"
                variant="solid"
                variantColor="green"
                px={3}
                // py={1}
                bg={fund.trending ? "green.900" : "red.900"}
                color="gray.100"
                fontSize="sm"
                fontWeight="700"
                rounded="md"
                // _hover={{ bg: "gray.500" }}
              >
                {fund.status}
              </Tag>

              <Stack
                direction="row"
                spacing={2}
                mt={2}
                divider={<StackDivider />}
                justifyContent="space-evenly"
              >
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Paid Amount</Heading>
                  <Heading fontSize="sm">
                    {toIndianCurrency(fund?.paidCounts * fund?.amount)}
                  </Heading>
                  <Heading fontSize="sm">
                    Paid Times: {fund?.paidCounts}
                  </Heading>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Remaining Amount</Heading>

                  <Tag size="sm" colorScheme="green" variant="subtle">
                    {toIndianCurrency(fund?.remainingCounts * fund?.amount)}
                  </Tag>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Transactions: </Heading>
                  <Button
                    size="xs"
                    onClick={() => {
                      setTransactionsToShow(fund?.transactions);
                      setShowTransactions(true);
                    }}
                  >
                    Show Details
                  </Button>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">
                    FUND
                    <br />
                    {fund?.fund?.name.substring(0, 20)}
                  </Heading>

                  <Tag
                    size="sm"
                    colorScheme={
                      (fund.riskCategory === "HIGH" && "red") ||
                      (fund.riskCategory === "MEDIUM" && "yellow") ||
                      (fund.riskCategory === "LOW" && "green")
                    }
                  >
                    {fund?.riskCategory}
                  </Tag>
                </Stack>
              </Stack>

              <Flex
                justifyContent="space-around"
                alignItems="center"
                mt={4}
                //   sx={{ w: "100%", bg: "red" }}
              >
                <Text
                  fontSize="sm"
                  noOfLines={0}
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  Created: {dayjs(fund?.createdAt).format("dddd, DD MMMM YYYY")}
                </Text>
                <Text
                  fontSize="sm"
                  noOfLines={0}
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  End Date: {dayjs(fund?.endDate).format("dddd, DD MMMM YYYY")}
                </Text>
                <Stack direction="row" spacing={1}>
                  <Button
                    color={useColorModeValue("brand.600", "brand.400")}
                    _hover={{ bg: "green.700" }}
                    size="sm"
                    variant="outline"
                    onClick={() => handlePauseSubscription(fund?.subscription)}
                  >
                    Pause
                  </Button>
                  <Button
                    color={useColorModeValue("brand.600", "brand.400")}
                    _hover={{ bg: "green.700" }}
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelSubscription(fund?.subscription)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color={useColorModeValue("brand.600", "brand.400")}
                    _hover={{ bg: "green.700" }}
                    size="sm"
                    variant="outline"
                    onClick={() => handleResumeSubscription(fund?.subscription)}
                  >
                    Resume
                  </Button>
                  <Button
                    color={useColorModeValue("brand.600", "brand.400")}
                    _hover={{ bg: "green.700" }}
                    size="sm"
                    variant="outline"
                    onClick={() => handleSyncSubscription(fund?.subscription)}
                  >
                    Sync
                  </Button>
                  handleSyncSubscription
                </Stack>
              </Flex>
            </MotionBox>
          ))}
        </MotionStack>
      )}

      <Box>
        <Pagination
          defaultPageSize={size}
          defaultPage={page}
          total={totalPages}
          paginationProps={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2em",
          }}
          pageNeighbours={1}
          showQuickJumper
          responsive
          onChange={(page) => setPage(page)}
          onShowSizeChange={(size, e) => setSize(parseFloat(e))}
          showSizeChanger
        />
      </Box>

      <ScrollModal
        showDailyChange={showTransactions}
        setShowDailyChange={setShowTransactions}
        // dailyChange={specificFund.dailyChange}
        title="Subscription Transactions"
      >
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Status</Th>
                <Th>Amount</Th>
                <Th>Subscription</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionsToShow?.map((dailyChange) => (
                <Tr key={dailyChange?._id}>
                  <Td>{dailyChange?.status}</Td>
                  <Td>{toIndianCurrency(dailyChange?.amountPaid)}</Td>
                  <Td>{dailyChange?.subscription}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </ScrollModal>
    </Box>
  );
};

export default SubscriptionManager;
