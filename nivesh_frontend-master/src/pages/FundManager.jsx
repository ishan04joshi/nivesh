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
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Text,
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
  getAllFunds,
  getSpecificUser,
  getUsers,
  newFund,
  updateUserToBlocked,
  updateUserToUnblocked,
  url,
} from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";

import { BsArrowUpRight } from "react-icons/bs";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
import { HiDotsHorizontal } from "react-icons/hi";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

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

const PackageManager = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [fundImage, setFundImage] = useState(null);
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
  const [count, setCount] = useState(0);
  const dailyChangeRef = React.useRef(null);
  const fundGraphRef = React.useRef(null);
  const [dailyChangeFile, setDailyChangeFile] = useState(null);
  const [fundGraphFile, setFundGraphFile] = useState(null);
  const [fundName, setFundName] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [fundShortDescription, setFundShortDescription] = useState("");
  const [fundMinimumInvestment, setFundMinimumInvestment] = useState(0);
  const [search, setSearch] = useState("");
  const [fundCAGR, setFundCAGR] = useState({
    oneYear: 0,
    threeYears: 0,
    fiveYears: 0,
  });
  const [fundReturns, setFundReturns] = useState({
    threeMonths: 0,
    sixMonths: 0,
    oneYear: 0,
    threeYears: 0,
    fiveYears: 0,
  });

  const filteredFunds = useMemo(() => {
    if (!search.trim()) return funds;
    return funds.filter((fund) =>
      fund.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [funds, search]);

  const reset = () => {
    setFundName("");
    setFundDescription("");
    setFundShortDescription("");
    setFundMinimumInvestment(0);
    setFundCAGR({
      oneYear: 0,
      threeYears: 0,
      fiveYears: 0,
    });
    setFundReturns({
      threeMonths: 0,
      sixMonths: 0,
      oneYear: 0,
      threeYears: 0,
      fiveYears: 0,
    });
    setDailyChangeFile(null);
    setFundGraphFile(null);
    setFundImage(null);
    setShares([]);
    setRiskCategory("HIGH");
  };

  const handleCreateNewFund = async () => {
    try {
      const formData = new FormData();
      formData.append("name", fundName);
      formData.append("description", fundDescription);
      formData.append("shortDescription", fundShortDescription);
      formData.append("minimumInvestment", fundMinimumInvestment);
      formData.append("riskCategory", riskCategory);
      formData.append("duration", duration);
      formData.append("cagr", JSON.stringify(fundCAGR));
      formData.append("returns", JSON.stringify(fundReturns));
      formData.append("dailyChangeFile", dailyChangeFile);
      formData.append("fundGraphFile", fundGraphFile);
      formData.append("shares", JSON.stringify(shares));
      formData.append("fundImageFile", fundImage);
      const { data } = await newFund(formData);
      console.log(data);
      if (data.status) {
        toast({
          title: "Fund Created Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        reset();
      }
      if (!data.status)
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
    } catch (e) {
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleGetAllFunds = async () => {
    try {
      const { data } = await getAllFunds(page, size);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      setFunds(data.data);
      setCount(data.count);
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

  useEffect(() => {
    handleGetAllFunds();
  }, [page, size]);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
      }}
    >
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Heading fontSize="4xl" mb={5}>
          CREATE / UPDATE FUNDS
        </Heading>
        <Stack direction="row" spacing={1}>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            alignSelf="center"
            maxW="120px"
          />

          {mode === "create" ? (
            <Button
              sx={{ alignSelf: "center" }}
              variant="outline"
              onClick={() => setMode("update")}
              alignSelf="center"
            >
              Back to Funds
            </Button>
          ) : (
            <Button
              colorScheme={"blue"}
              sx={{ alignSelf: "center" }}
              alignSelf="center"
              onClick={() => setMode("create")}
            >
              Add New Fund
            </Button>
          )}
        </Stack>
      </Stack>

      {mode === "update" && (
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
          {filteredFunds.length === 0 && (
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
              <Heading>No funds Found</Heading>
            </Stack>
          )}
          {filteredFunds.map((fund, idx) => (
            <MotionBox
              variants={listVariant}
              px={8}
              py={4}
              rounded="lg"
              shadow="lg"
              bg={useColorModeValue("white", "gray.800")}
              maxW="100%"
              key={idx + fund._id}
            >
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Stack spacing={2} direction="row">
                  <Tag
                    size="md"
                    variant="solid"
                    variantColor="green"
                    px={3}
                    // py={1}
                    bg={fund.trending ? "green.700" : "red.800"}
                    color="gray.100"
                    fontSize="sm"
                    fontWeight="700"
                    rounded="md"
                    // _hover={{ bg: "gray.500" }}
                  >
                    {fund.trending ? "Trending" : "Not Trending"}
                  </Tag>
                  <Tag
                    size="md"
                    variant="solid"
                    variantColor="green"
                    px={3}
                    fontSize="sm"
                    fontWeight="700"
                    rounded="md"
                  >
                    {fund.duration}
                  </Tag>
                </Stack>
                <Heading
                  fontSize="md"
                  color="blue.400"
                  textDecoration="underline"
                  cursor="pointer"
                >
                  {fund?.name}
                </Heading>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                mt={2}
                divider={<StackDivider />}
                justifyContent="space-evenly"
              >
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Minimum Investment</Heading>
                  <Heading fontSize="sm">
                    {toIndianCurrency(fund?.minimumInvestment || 0)}
                  </Heading>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">CAGR</Heading>
                  <Stack direction="row" spacing={2}>
                    <Tag size="sm" variantColor="green" variant="solid">
                      {fund?.cagr?.oneYear?.toFixed(2)}%
                    </Tag>
                    <Tag size="sm" variantColor="green" variant="solid">
                      {fund?.cagr?.threeYears?.toFixed(2)}%
                    </Tag>
                    <Tag size="sm" variantColor="green" variant="solid">
                      {fund?.cagr?.fiveYears?.toFixed(2)}%
                    </Tag>
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Enrolled By: </Heading>
                  <Heading fontSize="sm">
                    {fund?.enrolled?.length} People
                  </Heading>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">
                    RISK
                    <br />
                    CATEGORY
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
                <Button
                  color={useColorModeValue("brand.600", "brand.400")}
                  _hover={{ bg: "green.700" }}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate(`/fund/${fund._id}`);
                  }}
                >
                  Details
                </Button>
                <Button
                  color={useColorModeValue("brand.600", "brand.400")}
                  _hover={{ bg: "green.700" }}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate(`/update/fund/${fund._id}`);
                  }}
                >
                  Update
                </Button>
                <Button
                  color={useColorModeValue("brand.600", "brand.400")}
                  _hover={{ bg: "green.700" }}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate(`/buy/${fund._id}`);
                  }}
                >
                  Buy
                </Button>
              </Flex>
            </MotionBox>
          ))}
        </MotionStack>
      )}
      {mode === "create" && (
        <MotionStack direction="column" spacing={5} mt={10}>
          <Heading
            fontSize="2xl"
            color={useColorModeValue("gray.500", "gray.200")}
          >
            Please Fill Below details properly to create a new FUND.
          </Heading>
          <SimpleGrid columns={[1, 1, 2, 2]} spacing={5} p={3}>
            <GridItem>
              <Stack direction="column" spacing={6} divider={<StackDivider />}>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Name:{" "}
                  </Text>
                  <Input
                    placeholder="Enter Fund Name"
                    onChange={(e) => setFundName(e.target.value)}
                    variant="filled"
                  />
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Short Description:{" "}
                  </Text>
                  <Input
                    placeholder="Enter Fund Short Description"
                    variant="filled"
                    onChange={(e) => setFundShortDescription(e.target.value)}
                  />
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Long Description:{" "}
                  </Text>
                  <Input
                    placeholder="Enter Fund Long Description"
                    variant="filled"
                    onChange={(e) => setFundDescription(e.target.value)}
                  />
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Minimum Investment:{" "}
                  </Text>
                  <Input
                    placeholder="Enter Fund Minimum Investment"
                    variant="filled"
                    type="number"
                    onChange={(e) => setFundMinimumInvestment(e.target.value)}
                  />
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Risk Category:{" "}
                  </Text>
                  <Stack direction="row">
                    {["HIGH", "MEDIUM", "LOW"].map((risk, idx) => (
                      <Tag
                        key={idx + risk}
                        size="md"
                        variant="solid"
                        px={3}
                        py={2}
                        // bg={useColorModeValue("red.400", "red.800")}
                        colorScheme={
                          (idx === 0 && "red") ||
                          (idx === 1 && "green") ||
                          (idx === 2 && "blue")
                        }
                        as="button"
                        onClick={() => setRiskCategory(risk)}
                      >
                        <TagLabel>{risk}</TagLabel>
                        {risk === riskCategory && <TagRightIcon as={TiTick} />}
                      </Tag>
                    ))}
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Duration:{" "}
                  </Text>
                  <Stack direction="row">
                    {["SHORT", "MEDIUM", "LONG"].map((term, idx) => (
                      <Tag
                        key={idx + term}
                        size="md"
                        variant="solid"
                        px={3}
                        py={2}
                        // bg={useColorModeValue("red.400", "red.800")}
                        colorScheme={
                          (idx === 0 && "red") ||
                          (idx === 1 && "green") ||
                          (idx === 2 && "blue")
                        }
                        as="button"
                        onClick={() => setDuration(term)}
                      >
                        <TagLabel>{term}</TagLabel>
                        {term === duration && <TagRightIcon as={TiTick} />}
                      </Tag>
                    ))}
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={4}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Shares Allocation:{" "}
                  </Text>
                  <Stack direction="row" spacing={2}>
                    <Text sx={{ alignSelf: "center" }}>
                      ADD NEW SHARE ALLOCATION
                    </Text>
                    <IconButton
                      size="sm"
                      onClick={() =>
                        setShares([...shares, { name: "", allocation: 0 }])
                      }
                    >
                      <FaPlus />
                    </IconButton>
                  </Stack>
                  {shares.map((share, idx) => (
                    <Stack direction="column" spacing={4} key={idx}>
                      <Stack direction="row" spacing={2}>
                        <Input
                          variant={"filled"}
                          placeholder={"Enter Name"}
                          value={shares[idx].name}
                          type="text"
                          onChange={(e) => {
                            share.name = e.target.value;
                            setShares([...shares]);
                          }}
                        />
                        <Input
                          variant={"filled"}
                          placeholder={"Enter Allocation"}
                          value={share.allocation}
                          type="number"
                          onChange={(e) => {
                            shares[idx].allocation = parseFloat(e.target.value);
                            setShares([...shares]);
                          }}
                        />
                        {idx !== 0 && (
                          <IconButton
                            size="sm"
                            sx={{ alignSelf: "center" }}
                            onClick={() => {
                              shares.splice(idx, 1);
                              setShares([...shares]);
                            }}
                          >
                            <FaMinus />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </GridItem>
            <GridItem>
              <Stack direction="column" spacing={6} divider={<StackDivider />}>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund CAGR:{" "}
                  </Text>
                  <Stack direction="row" spacing={2}>
                    <Input
                      placeholder="1 Yr"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        setFundCAGR({
                          ...fundCAGR,
                          oneYear: parseFloat(e.target.value),
                        })
                      }
                    />
                    <Input
                      placeholder="3 Yrs"
                      onChange={(e) =>
                        setFundCAGR({
                          ...fundCAGR,
                          threeYears: parseFloat(e.target.value),
                        })
                      }
                      variant="filled"
                      type="number"
                    />
                    <Input
                      placeholder="5 Yrs"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        setFundCAGR({
                          ...fundCAGR,
                          fiveYears: parseFloat(e.target.value),
                        })
                      }
                    />
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Returns:{" "}
                  </Text>
                  <Stack direction="row" spacing={2}>
                    <Input
                      placeholder="3 Months"
                      onChange={(e) =>
                        setFundReturns({
                          ...fundReturns,
                          threeMonths: parseFloat(e.target.value),
                        })
                      }
                      variant="filled"
                      type="number"
                    />
                    <Input
                      placeholder="6 Months"
                      onChange={(e) =>
                        setFundReturns({
                          ...fundReturns,
                          sixMonths: parseFloat(e.target.value),
                        })
                      }
                      variant="filled"
                      type="number"
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Input
                      placeholder="1 Yr"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        setFundReturns({
                          ...fundReturns,
                          oneYear: parseFloat(e.target.value),
                        })
                      }
                    />
                    <Input
                      placeholder="3 Yrs"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        setFundReturns({
                          ...fundReturns,
                          threeYears: parseFloat(e.target.value),
                        })
                      }
                    />
                    <Input
                      placeholder="5 Yrs"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        setFundReturns({
                          ...fundReturns,
                          fiveYears: parseFloat(e.target.value),
                        })
                      }
                    />
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Daily Change File: (.csv files only, MAX SIZE: 2MB)
                  </Text>
                  <Input
                    ref={dailyChangeRef}
                    display="none"
                    aria-hidden="true"
                    accept=".csv"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        if (e.target.files[0].size > 2000000)
                          return toast({
                            title: "File size is too large",
                            description: "Please upload a file less than 2MB",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "bottom-right",
                          });
                      }
                      setDailyChangeFile(e.target.files[0]);
                    }}
                  />
                  <Stack spacing={2} direction="row">
                    <Text
                      color={useColorModeValue("gray.600", "gray.200")}
                      alignSelf="center"
                    >
                      Uploaded: {dailyChangeFile && dailyChangeFile.name}
                    </Text>
                    {dailyChangeFile && (
                      <IconButton onClick={() => setDailyChangeFile(null)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <Button
                    variant="outline"
                    onClick={() => dailyChangeRef.current.click()}
                  >
                    Upload File
                  </Button>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Graph File: (.csv files only, MAX SIZE: 2MB)
                  </Text>
                  <Input
                    ref={fundGraphRef}
                    display="none"
                    aria-hidden="true"
                    accept=".csv"
                    variant="filled"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        if (e.target.files[0].size > 2000000)
                          return toast({
                            title: "File size is too large",
                            description: "Please upload a file less than 2MB",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "bottom-right",
                          });
                      }
                      setFundGraphFile(e.target.files[0]);
                    }}
                  />
                  <Stack spacing={2} direction="row">
                    <Text
                      color={useColorModeValue("gray.600", "gray.200")}
                      alignSelf="center"
                    >
                      Uploaded: {fundGraphFile && fundGraphFile.name}
                    </Text>
                    {fundGraphFile && (
                      <IconButton onClick={() => setFundGraphFile(null)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <Button
                    variant="outline"
                    onClick={() => fundGraphRef.current.click()}
                  >
                    Upload File
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  <Text
                    fontSize="lg"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    Fund Image: (.png files only, MAX SIZE: 2MB)
                  </Text>
                  {fundImage && (
                    <Image
                      objectFit="contain"
                      w="100px"
                      h="70px"
                      src={fundImage}
                      alt={fundName}
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                  )}
                  <Input
                    //check filetype+ file szie
                    type="file"
                    onChange={(e) => setFundImage(e.target.files[0])}
                  />
                </Stack>
                <Button variant="outline" onClick={handleCreateNewFund}>
                  CREATE FUND
                </Button>
              </Stack>
            </GridItem>
          </SimpleGrid>
        </MotionStack>
      )}
      {mode === "update" && (
        <Box>
          {filteredFunds.length > 0 && (
            <Pagination
              defaultPageSize={size}
              defaultPage={page}
              total={count}
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
          )}
        </Box>
      )}
    </Box>
  );
};

export default PackageManager;
