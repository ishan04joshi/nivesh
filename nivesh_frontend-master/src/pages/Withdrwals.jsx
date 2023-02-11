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
  completeWithdrawal,
  createWithdrawal,
  deleteNews,
  getAllNews,
  getAllWithdrawals,
  getSpecificFund,
  getSpecificUser,
  rejectedWithdrawal,
  url,
} from "../api/apis";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

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
  const [fundId, setFundId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState("");

  const handleGetAllWithdrawals = async () => {
    try {
      const { data } = await getAllWithdrawals(page, size);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

      setWithdrawals(data?.data);
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
  const handleWithdrawalStatusToApprove = async (id) => {
    try {
      const { data } = await approveWithdrawal({ id });
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

      handleGetAllWithdrawals();
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
      if (!utr)
        return toast({
          title: "Error",
          description: "Please enter UTR",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      const { data } = await completeWithdrawal({ id, utr });
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      handleGetAllWithdrawals();
      toast({
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
  const handleRejectedWithdrawal = async (id) => {
    try {
      const { data } = await rejectedWithdrawal({ id });
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      handleGetAllWithdrawals();
      toast({
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
  const handleAddWithdrawal = async () => {
    if (!fundId || isNaN(amount) || amount <= 0)
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
      const { data } = await createWithdrawal({
        fund: fundId,
        amount: amount,
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

      handleGetAllWithdrawals();
      onClose();
      resetNewsForm();
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
    handleGetAllWithdrawals();
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
        px: 2,
        py: 4,
        // justifyContent: "center",
        // bg: "red",
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Heading color="gray.600">Add Withdrawal</Heading>
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
          lg: "lg",
          xl: "xl",
        })}
        sx={{ mx: 2 }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdrawal Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Stack spacing={1}>
                <Text color="gray.700">Available Funds:</Text>
                <Select
                  value={fundId}
                  onChange={(e) => setFundId(e.target.value)}
                  placeholder="Select a Fund"
                >
                  {user?.funds?.map((fund) => {
                    return (
                      <option key={fund?.id?._id} value={fund?.id?._id}>
                        {fund?.id?.name}
                      </option>
                    );
                  })}
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Text color="gray.700">Amount to Withdraw:</Text>
                <Input
                  placeholder="Enter Amount"
                  required
                  type="number"
                  min={0}
                  size="md"
                  onChange={(e) => setAmount(+e.target.value)}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="solid"
                  bg="#0D74FF"
                  color="white"
                  onClick={handleAddWithdrawal}
                  isDisabled={loading}
                  isLoading={loading}
                >
                  Withdraw
                </Button>
                <Button
                  onClick={onClose}
                  isDisabled={loading}
                  isLoading={loading}
                >
                  Close
                </Button>            
              </Stack>
              <Stack spacing={1}>
                <Text color="gray.700" fontSize="0.7rem">(Charges may applicable). (After approval of withdrawal request, it will take up to 3-4
working days to credit the amount in your Bank account).</Text>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter></ModalFooter>
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
        {withdrawals?.length === 0 && (
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
            <Heading>No Withdrawals Found!</Heading>
          </Stack>
        )}
        <Stack spacing={3}>
          {withdrawals?.map((n, idx) => (
            <MotionBox
              variants={listVariant}
              px={8}
              py={4}
              rounded="lg"
              shadow="lg"
              bg={useColorModeValue("white", "gray.800")}
              maxW="100%"
              key={idx + n._id}
            >
              <Stack direction="row" spacing={2} justifyContent="space-evenly">
                <Stack
                  ml={2}
                  w="100%"
                  direction="row"
                  spacing={4}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} divider={<StackDivider />}>
                    <Stack spacing={1}>
                      <Heading size="xs" color="gray.700">
                        User: {n?.user?.firstName} {n?.user?.lastName}
                      </Heading>
                      <Text size="xs" color="gray.700">
                        PAN: {n?.user?.pan?.id}
                      </Text>
                    </Stack>
                    <Heading size="md" alignSelf="center">
                      {n?.fund?.name}
                    </Heading>
                    <Tag size="lg" colorScheme="blue">
                      {toIndianCurrency(n?.amount)}
                    </Tag>
                    <Tag size="lg" colorScheme="blue">
                      {dayjs(n?.createdAt).format("DD-MM-YYYY")}
                    </Tag>
                    <Tag size="lg" colorScheme="green">
                      {n?.status}
                    </Tag>
                    {n.status === "completed" && (
                      <Tag size="lg" colorScheme="gray">
                        UTR: {n?.utr}
                      </Tag>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {n?.status === "approved" && user?.isAdmin && (
                      <Stack spacing={1} direction="row">
                        <Input
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="Enter UTR"
                          w="150px"
                          alignSelf={"center"}
                          size={"xs"}
                        />
                        <Button
                          alignSelf={"center"}
                          onClick={() =>
                            handleWithdrawalStatusToComplete(n?._id)
                          }
                          colorScheme="red"
                          size="sm"
                          variant="solid"
                        >
                          Complete
                        </Button>
                      </Stack>
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

                        <Button
                          onClick={() =>
                            handleWithdrawalStatusToApprove(n?._id)
                          }
                          colorScheme="green"
                          size="sm"
                          variant="solid"
                        >
                          Approve
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </MotionBox>
          ))}
        </Stack>
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
