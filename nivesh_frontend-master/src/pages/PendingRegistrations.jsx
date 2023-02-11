import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import Lottie, { useLottie } from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import {
  baseurl,
  getPendingRegistrations,
  getSpecificUser,
  updatePendingUserToRejected,
  updatePendingUserToVerified,
  url,
} from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";

import { BsArrowUpRight } from "react-icons/bs";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
import { FaStar } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import Pagination from "@choc-ui/paginator";
import { TiTickOutline } from "react-icons/ti";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const MotionStack = motion(Stack);
const MotionBox = motion(Box);

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: EmptyLottie,
};

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
  const { View } = useLottie(lottieOptions);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [users, setUsers] = useState([]);
  const [specificUserId, setSpecificUserId] = useState(null);
  const [specificUserDetails, setSpecificUserDetails] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rejectionReason = useRef();
  const cancelAlertRef = useRef();
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();

  const handleGetPendingRegistrationUsers = async () => {
    try {
      const { data } = await getPendingRegistrations(page, size);
      if (data.status) {
        setUsers(data.data);
        toast({
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

  const handleUpdatePendingUserToVerified = async () => {
    try {
      const { data } = await updatePendingUserToVerified(specificUserId);
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
        handleGetPendingRegistrationUsers();
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
        description: "Something went wrong" + e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleUpdatePendingUserToRejected = async () => {
    try {
      const { data } = await updatePendingUserToRejected(
        specificUserId,
        rejectionReason.current.value
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
        onCloseAlert();
        onClose();
        setSpecificUserId(null);
        setSpecificUserDetails(null);
        handleGetPendingRegistrationUsers();
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
        description: "Something went wrong" + e.message,
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
    handleGetPendingRegistrationUsers();
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
                            baseurl +
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
                            baseurl +
                              "/assets/" +
                              specificUserDetails?._id +
                              "/" +
                              specificUserDetails?.aadhar?.file
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
                            baseurl +
                              "/assets/" +
                              specificUserDetails?._id +
                              "/" +
                              specificUserDetails?.pan?.file
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
              {!specificUserDetails?.status !== "approved" && (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button onClick={handleUpdatePendingUserToVerified}>
                    Verify
                  </Button>
                  <Button onClick={onOpenAlert}>Reject</Button>
                </Stack>
              )}
              <Button onClick={onClose}>Close</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    [isOpen]
  );

  const AlertDialogRejection = React.useCallback(
    () => (
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelAlertRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reject Registration
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
              <Input
                noOfLines={4}
                placeholder="Enter reason"
                sx={{ my: 5 }}
                ref={rejectionReason}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelAlertRef} onClick={onCloseAlert}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleUpdatePendingUserToRejected}
                ml={3}
              >
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    ),
    [isOpenAlert]
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
      <UserDetailModal />
      <AlertDialogRejection />
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
        {users.length === 0 && (
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            h="80vh"
            // bg="red"
          >
            <Lottie
              animationData={EmptyLottie}
              autoPlay={true}
              loop={true}
              style={{ height: "60vh", width: "60vw" }}
            />
            <Heading>No Users Found</Heading>
          </Stack>
        )}
        {users.map((user, idx) => (
          <MotionBox
            variants={listVariant}
            px={8}
            py={4}
            rounded="lg"
            shadow="lg"
            bg={useColorModeValue("white", "gray.800")}
            maxW="100%"
            key={idx + user?._id}
          >
            <Tag
              size="md"
              variant="solid"
              variantColor="green"
              px={3}
              // py={1}
              bg={user.verified ? "green.900" : "red.900"}
              color="gray.100"
              fontSize="sm"
              fontWeight="700"
              rounded="md"
              // _hover={{ bg: "gray.500" }}
            >
              {user?.status}
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
                  {toIndianCurrency(user?.invested || 0)}
                </Heading>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">PROFIT</Heading>
                <Heading fontSize="sm">
                  {toIndianCurrency(user?.invested || 0)}
                </Heading>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Heading fontSize="md">LOSS</Heading>
                <Heading fontSize="sm">
                  {toIndianCurrency(user?.invested || 0)}
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
                Created: {dayjs(user?.createdAt).format("dddd, DD MMMM YYYY")}
              </Text>
              <Button
                color={useColorModeValue("brand.600", "brand.400")}
                _hover={{ bg: "green.700" }}
                size="sm"
                variant="outline"
                onClick={() => {
                  if (specificUserId === user?._id) return onOpen();
                  setSpecificUserId(user?._id);
                }}
                isLoading={fetchingUser}
              >
                Details
              </Button>

              <Flex alignItems="center">
                <Avatar
                  mx={4}
                  size="sm"
                  src={baseurl + "/assets/" + user?._id + "/" + user?.avatar}
                  name={user?.firstName + user?.lastName}
                />

                <Text
                  color={useColorModeValue("gray.700", "gray.200")}
                  fontWeight="700"
                >
                  {user?.firstName?.toUpperCase() ||
                    "none" + " " + user?.lastName?.toUpperCase() ||
                    "none"}
                </Text>
              </Flex>
            </Flex>
          </MotionBox>
        ))}
      </MotionStack>
      <Box sx={{}}>
        {users.length > 0 && (
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

export default AllUsers;
