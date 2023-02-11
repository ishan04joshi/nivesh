import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
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
  Tag,
  TagCloseButton,
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
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useMemo, useState } from "react";
import {
  getSpecificUser,
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
  const [users, setUsers] = useState([]);
  const [specificUserId, setSpecificUserId] = useState(null);
  const [specificUserDetails, setSpecificUserDetails] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const filteredUsers = useMemo(() => {
    if (activeFilter === "all" || !activeFilter) return users;
    if (activeFilter === "blocked")
      return users.filter((u) => u?.status === "blocked");
    if (activeFilter === "pending")
      return users.filter((u) => u.status === "pending");
    if (activeFilter === "approved")
      return users.filter((u) => u.status === "approved");
  }, [users, activeFilter]);

  const updatedUsers = useMemo(() => {
    if (search === "" || !search) return filteredUsers;
    return filteredUsers.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, filteredUsers]);

  const handleGetAllUsers = async () => {
    try {
      const { data } = await getUsers(page, size);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      setTotalPages(data.count || 0);
      setUsers(data.data);
      return toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
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

  const handleFetchSpecificUser = async () => {
    setFetchingUser(true);
    try {
      const { data } = await getSpecificUser(specificUserId);
      if (data.status) {
        setFetchingUser(false);
        setSpecificUserDetails(data.data);
        onOpen();
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
      if (!data.status)
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      setFetchingUser(false);
    } catch (e) {
      setFetchingUser(false);
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

  const handleUpdateUserToBlocked = async () => {
    try {
      if (!specificUserId) return;
      const { data } = await updateUserToBlocked(specificUserId);
      if (data.status) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        onClose();
        setSpecificUserDetails(null);
        setSpecificUserId(null);
        handleGetAllUsers();
      }
      if (!data.status)
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
    } catch (e) {
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

  const handleUpdateUserToApprove = async () => {
    try {
      if (!specificUserId) return;
      const { data } = await updatePendingUserToApproved(specificUserId);
      if (data.status) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        onClose();
        setSpecificUserDetails(null);
        setSpecificUserId(null);
        handleGetAllUsers();
      }
      if (!data.status)
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
    } catch (e) {
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
  const handleUpdateUserToReject = async () => {
    try {
      if (!specificUserId) return;
      const { data } = await updatePendingUserToRejected(
        specificUserId,
        specificUserDetails.reason
      );
      if (data.status) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        onClose();
        setSpecificUserDetails(null);
        setSpecificUserId(null);
        handleGetAllUsers();
      }
      if (!data.status)
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
    } catch (e) {
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
  const handleUpdateUserToUnblocked = async () => {
    try {
      if (!specificUserId) return;
      const { data } = await updateUserToUnblocked(specificUserId);
      if (data.status) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        onClose();
        setSpecificUserDetails(null);
        setSpecificUserId(null);
        handleGetAllUsers();
      }
      if (!data.status)
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
    } catch (e) {
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
    if (!specificUserId) return;
    handleFetchSpecificUser();
  }, [specificUserId]);

  useEffect(() => {
    handleGetAllUsers();
  }, [page, size]);

  const UserDetailModal = React.useCallback(
    (user) => (
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
          <ModalHeader>USER DETAILS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                  >
                    {specificUserDetails?.firstName}{" "}
                    {specificUserDetails?.lastName}
                  </Heading>
                  <Tag
                    variant="solid"
                    fontWeight="bold"
                    // rounded="md"
                    bg={
                      specificUserDetails?.status === "approved"
                        ? "green.800"
                        : "red.800"
                    }
                  >
                    <TagLeftIcon as={TiTickOutline} />
                    <TagLabel>{specificUserDetails?.status}</TagLabel>
                  </Tag>
                </Stack>
                <Text
                  color={useColorModeValue("gray.900", "gray.400")}
                  fontWeight={300}
                  fontSize={"2xl"}
                >
                  {toIndianCurrency(specificUserDetails?.invested || 0)} INR
                </Text>
              </Box>

              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={"column"}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
              >
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    SUMMARY
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <List spacing={2}>
                      <ListItem>
                        INVESTED:{" "}
                        <strong>
                          {toIndianCurrency(specificUserDetails?.invested || 0)}
                        </strong>
                      </ListItem>
                      <ListItem>
                        PROFIT:{" "}
                        <strong>
                          {toIndianCurrency(specificUserDetails?.invested || 0)}
                        </strong>
                      </ListItem>
                      <ListItem>
                        LOSS:{" "}
                        <strong>
                          {toIndianCurrency(specificUserDetails?.invested || 0)}
                        </strong>
                      </ListItem>
                    </List>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    PERSONAL Details
                  </Text>

                  <List spacing={2}>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        ID:
                      </Text>{" "}
                      {specificUserDetails?.id}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        First Name:
                      </Text>{" "}
                      {specificUserDetails?.firstName}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Last Name:
                      </Text>{" "}
                      {specificUserDetails?.lastName}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Phone:
                      </Text>{" "}
                      +91 {specificUserDetails?.phone}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Email:
                      </Text>{" "}
                      {specificUserDetails?.email}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        City:
                      </Text>{" "}
                      {specificUserDetails?.city}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        State:
                      </Text>{" "}
                      {specificUserDetails?.state}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Zip:
                      </Text>{" "}
                      {specificUserDetails?.zip}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Address:
                      </Text>{" "}
                      {specificUserDetails?.address}
                    </ListItem>
                  </List>
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    BANK DETAILS
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <List spacing={2}>
                      <ListItem>
                        Bank Account Type:{" "}
                        {specificUserDetails?.bankAccount?.type}
                      </ListItem>
                      <ListItem>
                        Bank Name: {specificUserDetails?.bankAccount?.bankName}
                      </ListItem>
                      <ListItem>
                        Account Number:{" "}
                        {specificUserDetails?.bankAccount?.accountNo}
                      </ListItem>
                      <ListItem>
                        IFSC: {specificUserDetails?.bankAccount?.ifsc}
                      </ListItem>
                      <ListItem>
                        Bank Branch Name:{" "}
                        {specificUserDetails?.bankAccount?.branch}
                      </ListItem>
                      <Button
                        variant="link"
                        rightIcon={<BsArrowUpRight />}
                        onClick={() =>
                          window.open(
                            url +
                              "/assets/" +
                              specificUserDetails?._id +
                              "/" +
                              specificUserDetails?.bankAccount?.document
                          )
                        }
                      >
                        View Bank Attachment
                      </Button>
                    </List>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    IDENTITY DETAILS
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                    <List spacing={2}>
                      <ListItem>
                        AADHAR Number: {specificUserDetails?.aadhar?.id}
                      </ListItem>
                      <ListItem>PAN: {specificUserDetails?.pan?.id}</ListItem>
                      <Button
                        variant="link"
                        rightIcon={<BsArrowUpRight />}
                        onClick={() =>
                          window.open(
                            url +
                              "/assets/" +
                              specificUserDetails?._id +
                              "/" +
                              specificUserDetails?.aadhar.file
                          )
                        }
                      >
                        View Aadhar Attachment
                      </Button>
                      <Button
                        variant="link"
                        rightIcon={<BsArrowUpRight />}
                        onClick={() =>
                          window.open(
                            url +
                              "/assets/" +
                              specificUserDetails?._id +
                              "/" +
                              specificUserDetails?.pan.file
                          )
                        }
                      >
                        View PAN Attachment
                      </Button>
                    </List>
                  </SimpleGrid>
                </Box>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={2}>
              {specificUserDetails?.status === "blocked" && (
                <Button onClick={handleUpdateUserToUnblocked}>Unblock</Button>
              )}
              {specificUserDetails?.status === "approved" && (
                <Button onClick={handleUpdateUserToBlocked}>Block</Button>
              )}
              {specificUserDetails?.status === "pending" && (
                <>
                  <Button onClick={handleUpdateUserToApprove}>Approve</Button>
                  <Button onClick={handleUpdateUserToReject}>Reject</Button>
                </>
              )}
              <Button onClick={onClose}>Close</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    [isOpen]
  );

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
      <Stack direction="row" justifyContent={"space-between"} my={4}>
        <Heading color="gray.600">Market Values</Heading>
        <Input
          w="150px"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          focusBorderColor="blue.500"
          variant={"filled"}
          bg="white"
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        {["all", "pending", "approved", "blocked"].map((status) => (
          <Tag
            key={status}
            variant="subtle"
            colorScheme={"blue"}
            onClick={() => setActiveFilter(status)}
            cursor="pointer"
          >
            <TagLabel>{status.toUpperCase()}</TagLabel>
            {activeFilter === status && (
              <TagCloseButton onClick={() => setActiveFilter("all")} />
            )}
          </Tag>
        ))}
      </Stack>
      <UserDetailModal />
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
        {updatedUsers.length === 0 && (
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
            <Heading>No Users Found</Heading>
          </Stack>
        )}
        {updatedUsers.map((user, idx) => (
          <MotionBox
            variants={listVariant}
            px={8}
            py={4}
            rounded="lg"
            shadow="lg"
            bg={useColorModeValue("white", "gray.800")}
            maxW="100%"
            key={idx + user._id}
          >
            <Tag
              size="md"
              variant="subtle"
              colorScheme="green"
              px={3}
              fontSize="sm"
              fontWeight="700"
              rounded="md"
            >
              {user.status}
            </Tag>

            <Stack
              direction="row"
              spacing={2}
              mt={2}
              divider={<StackDivider />}
              justifyContent="space-evenly"
            >
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">INVESTED</Heading>
                <Heading fontSize="sm">
                  {toIndianCurrency(user.invested || 0)}
                </Heading>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">PROFIT</Heading>
                <Heading fontSize="sm">
                  {toIndianCurrency(user.invested || 0)}
                </Heading>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">LOSS</Heading>
                <Heading fontSize="sm">
                  {toIndianCurrency(user.invested || 0)}
                </Heading>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">
                  PACKAGES
                  <br />
                  BOUGHT
                </Heading>
                <Heading fontSize="sm">0</Heading>
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
                Created: {dayjs(user.createdAt).format("dddd, DD MMMM YYYY")}
              </Text>
              <Button
                color={useColorModeValue("brand.600", "brand.400")}
                _hover={{ bg: "green.700" }}
                size="sm"
                variant="outline"
                onClick={() => {
                  if (specificUserId === user._id) return onOpen();
                  setSpecificUserId(user._id);
                }}
                isLoading={fetchingUser}
              >
                Details
              </Button>

              <Flex alignItems="center">
                <Avatar
                  mx={4}
                  size="sm"
                  src={url + "/assets/" + user._id + "/" + user.avatar}
                  name={user.firstName + user.lastName}
                />

                <Text
                  color={useColorModeValue("gray.700", "gray.200")}
                  fontWeight="700"
                >
                  {user?.firstName?.toUpperCase() +
                    " " +
                    user?.lastName?.toUpperCase()}
                </Text>
              </Flex>
            </Flex>
          </MotionBox>
        ))}
      </MotionStack>
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
          onShowSizeChange={(size, e) => setSize(parseInt(e))}
          showSizeChanger
        />
      </Box>
    </Box>
  );
};

export default AllUsers;
