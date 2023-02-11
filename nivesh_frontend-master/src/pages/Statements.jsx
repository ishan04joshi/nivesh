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
import React, { useEffect, useState } from "react";
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
  getSpecificFund,
  getSpecificUser,
  rejectStatement,
  rejectedWithdrawal,
  url,
} from "../api/apis";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { AddIcon } from "@chakra-ui/icons";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
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
  const [statements, setStatements] = useState([]);
  const [fundId, setFundId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState([]);

  const handleGetAllStatements = async () => {
    try {
      const { data } = await getAllStatements(page, size);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

      setStatements(data?.data);
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
        position: "bottom-right",
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

  const resetNewsForm = () => {
    setNewsTitle("");
    setNewsDescription("");
    setNewsImage(null);
    setNewsCategory("");
  };

  useEffect(() => {
    handleGetAllStatements();
  }, [page, size]);
  useEffect(() => {
    if (!location?.state?.fund) return;
    setFundId(location?.state?.fund);
    onOpen();
  }, [location?.state?.fund]);

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
        <Heading color="gray.600">Request Statements</Heading>
        {!user?.isAdmin && (
          <Button colorScheme={"blue"} onClick={onOpen}>
            Request New Statement
          </Button>
        )}
      </Stack>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        scrollBehavior="inside"
        size={useBreakpointValue({
          base: "sm",
          sm: "md",
          md: "md",
          lg: "3xl",
          xl: "3xl",
        })}
        sx={{ mx: 2 }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Stack direction="row" spacing={3}>
              <Text alignSelf="center">Request New Account Statement </Text>
              <IconButton
                icon={<AddIcon />}
                aria-label="new-request"
                variant={"outline"}
                onClick={() => {
                  setRequested((prev) => [
                    ...prev,
                    { fund: null, dateType: "Last 1 Month" },
                  ]);
                }}
              />
            </Stack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              {requested.map((req, idx) => (
                <Stack direction="column" spacing={3} key={idx * 2}>
                  <Select
                    placeholder="Select Fund"
                    onChange={(e) => {
                      const newRequested = [...requested];
                      newRequested[idx].fund = e.target.value;
                      setRequested(newRequested);
                    }}
                  >
                    {user?.funds?.map((fund) => (
                      <option key={fund?.id?._id} value={fund?.id?._id}>
                        {fund?.id?.name}
                      </option>
                    ))}
                  </Select>
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-around"
                  >
                    <Stack direction="column" spacing={1}>
                      <Text>Range:</Text>
                      <Select
                        placeholder="Select Date Range"
                        onChange={(e) => {
                          const newRequested = [...requested];
                          newRequested[idx].dateType = e.target.value;
                          setRequested(newRequested);
                        }}
                      >
                        <option value="Last 1 Month">Last 1 Month</option>
                        <option value="Last 3 Months">Last 3 Months</option>
                        <option value="Last 6 Months">Last 6 Months</option>
                        <option value="Last 1 Year">Last 1 Year</option>
                        <option value="custom">Custom</option>
                      </Select>
                    </Stack>
                    {req.dateType === "custom" && (
                      <Stack direction="row" spacing={1} alignSelf="center">
                        <Stack spacing={0}>
                          <Text>From:</Text>
                          <Input
                            type="date"
                            value={req?.date?.from}
                            onChange={(e) => {
                              const newRequested = [...requested];
                              newRequested[idx].date = {
                                ...newRequested[idx].date,
                                from: e.target.value,
                              };
                              setRequested(newRequested);
                            }}
                          />
                        </Stack>
                        <Stack spacing={0}>
                          <Text>To:</Text>
                          <Input
                            type="date"
                            value={req?.date?.to}
                            onChange={(e) => {
                              const newRequested = [...requested];
                              newRequested[idx].date = {
                                ...newRequested[idx].date,
                                to: e.target.value,
                              };
                              setRequested(newRequested);
                            }}
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={3} alignSelf="end">
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        const newRequested = [...requested];
                        newRequested.splice(idx, 1);
                        setRequested(newRequested);
                      }}
                    >
                      Discard
                    </Button>
                    {/* <Button colorScheme="blue">Add New</Button> */}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddWithdrawal}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
        {statements?.length === 0 && (
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
            <Heading>No Statements Requested!</Heading>
          </Stack>
        )}
        <Accordion defaultIndex={[0]}>
          <Stack spacing={3}>
            {statements?.map((n, idx) => (
              <AccordionItem>
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
                      direction="row"
                      spacing={2}
                      justifyContent="space-evenly"
                    >
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
                              {n?.user?.firstName} {n?.user?.lastName}
                            </Heading>
                            <Text
                              size="sm"
                              alignSelf="center"
                              color="gray.600"
                              noOfLines={2}
                            >
                              PAN: {n?.user?.pan?.id}
                            </Text>
                          </Stack>
                          <Text color="gray.600" size="md" alignSelf="center">
                            Created At:{" "}
                            {dayjs(n?.createdAt).format("DD-MM-YYYY")}
                          </Text>
                          <Text color="gray.500" size="md" alignSelf="center">
                            Requested For: {n?.requested?.length} Statements
                          </Text>
                          <Tag size="lg" colorScheme="gray">
                            {n?.status}
                          </Tag>
                        </Stack>
                      </Stack>
                    </Stack>
                  </AccordionButton>
                </MotionBox>

                <AccordionPanel
                  pb={4}
                  border="1px"
                  rounded="lg"
                  borderTop={"0px"}
                  borderColor="gray.400"
                >
                  <MotionBox px={2} py={2}>
                    <Stack direction="column" spacing={3}>
                      {n?.requested?.map((req, idx) => (
                        <Stack direction="row" spacing={3} key={req?._id}>
                          <Heading color="gray.600" fontSize="sm">
                            {req?.fund?.name}
                          </Heading>
                          <Text color="gray.400" fontSize="xs">
                            Range: {req?.dateType}
                          </Text>
                          {req?.dateType === "custom" && (
                            <Text color="gray.600" fontSize="sm">
                              {req?.date?.from} {"<==>"} {req?.date?.to}
                            </Text>
                          )}
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
