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
  Checkbox,
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
import React, { useEffect, useState } from "react";
import { TiTick, TiTickOutline } from "react-icons/ti";
import {
  getAllFunds,
  getSpecificFund,
  getSpecificUser,
  getUsers,
  newFund,
  prefix,
  updateFund,
  updateUserToBlocked,
  updateUserToUnblocked,
  url,
} from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";
import { useNavigate, useParams } from "react-router-dom";

import { BsArrowUpRight } from "react-icons/bs";
import DailyChangeTable from "../components/DailyChangeTable";
import EmptyLottie from "../assets/lottie/emptyRecords.json";
import FundGraphTable from "../components/FundGraphTable";
import { HiDotsHorizontal } from "react-icons/hi";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import ScrollModal from "../components/ScrollModal";
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

const PackageManager = () => {
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDailyChange, setShowDailyChange] = useState(false);
  const [showFundGraph, setShowFundGraph] = useState(false);
  const [specificFund, setSpecificFund] = useState(null);
  const [riskCategory, setRiskCategory] = useState("HIGH");
  const [shares, setShares] = useState([]);
  const dailyChangeRef = React.useRef(null);
  const [todayValue, setTodayValue] = useState(0);
  const fundGraphRef = React.useRef(null);
  const [trending, setTrending] = useState(false);
  const [dailyChangeFile, setDailyChangeFile] = useState(null);
  const [fundGraphFile, setFundGraphFile] = useState(null);
  const [fundName, setFundName] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [fundShortDescription, setFundShortDescription] = useState("");
  const [fundMinimumInvestment, setFundMinimumInvestment] = useState(0);
  const [duration, setDuration] = useState("SHORT");

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

  const handleGetFundDetails = async () => {
    if (!params.id) return;
    try {
      const { data } = await getSpecificFund(params.id);
      if (data.status) {
        setSpecificFund(data.data);
        setLoading(false);
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
      console.log(e);
      toast({
        title: "Error",
        description: "Could not get fund details",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  const handleFundUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", specificFund._id);
      formData.append("todayValue", todayValue);
      formData.append("name", fundName);
      formData.append("description", fundDescription);
      formData.append("duration", duration);
      formData.append("shortDescription", fundShortDescription);
      formData.append("minimumInvestment", fundMinimumInvestment);
      formData.append("cagr", JSON.stringify(fundCAGR));
      formData.append("returns", JSON.stringify(fundReturns));
      formData.append("riskCategory", riskCategory);
      formData.append("shares", JSON.stringify(shares));
      formData.append("trending", trending);

      if (dailyChangeFile) formData.append("dailyChangeFile", dailyChangeFile);
      if (fundGraphFile) formData.append("fundGraphFile", fundGraphFile);
      const { data } = await updateFund(formData);

      if (data.status) {
        setSpecificFund(data.data);
        setDailyChangeFile(null);
        setFundGraphFile(null);
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
    } catch (e) {
      console.log(
        "🚀 ~ file: FundUpdate.jsx ~ line 262 ~ handleFundUpdate ~ e",
        e
      );
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
    handleGetFundDetails();
  }, []);

  // useEffect(() => {
  //   handleGetAllFunds();
  // }, [page, size]);

  useEffect(() => {
    specificFund?.name && setFundName(specificFund.name);
    specificFund?.description && setFundDescription(specificFund.description);
    specificFund?.shortDescription &&
      setFundShortDescription(specificFund.shortDescription);
    specificFund?.minimumInvestment &&
      setFundMinimumInvestment(specificFund.minimumInvestment);
    specificFund?.riskCategory && setRiskCategory(specificFund.riskCategory);
    specificFund?.cagr && setFundCAGR(specificFund.cagr);
    specificFund?.returns && setFundReturns(specificFund.returns);
    specificFund?.shares && setShares(specificFund.shares);
  }, [specificFund]);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
      }}
    >
      <Heading fontSize="4xl" mb={5}>
        UPDATE FUND: {specificFund?.name}
      </Heading>

      <MotionStack direction="column" spacing={5} mt={10}>
        <Heading
          fontSize="2xl"
          color={useColorModeValue("gray.500", "gray.200")}
        >
          Please Fill Below details properly to update the FUND.
        </Heading>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={5} p={3}>
          <GridItem>
            <Stack direction="column" spacing={4}>
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
                  value={fundName}
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
                  value={fundShortDescription}
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
                  value={fundDescription}
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
                  value={fundMinimumInvestment}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Text
                  fontSize="lg"
                  color={useColorModeValue("gray.500", "gray.400")}
                >
                  Trending:{" "}
                </Text>
                <Checkbox
                  variant="filled"
                  checked={trending}
                  onChange={() => setTrending(!trending)}
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
                      size="md"
                      variant="solid"
                      px={3}
                      py={2}
                      key={idx}
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
                      setShares([
                        ...shares,
                        { name: "Change Name", allocation: 0 },
                      ])
                    }
                  >
                    <FaPlus />
                  </IconButton>
                </Stack>
                {shares.map((share, idx) => (
                  <Stack direction="column" spacing={4} key={idx + idx + 1}>
                    <Stack direction="row" spacing={2}>
                      <Input
                        variant={"filled"}
                        placeholder={"Enter Name"}
                        value={share.name}
                        onChange={(e) => {
                          shares[idx].name = e.target.value;
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
            <Stack direction="column" spacing={4}>
              <Stack direction="column" spacing={2}>
                <Text
                  fontSize="lg"
                  color={useColorModeValue("gray.500", "gray.400")}
                >
                  Fund CAGR:{" "}
                </Text>
                <Stack direction="row" spacing={2}>
                  <Input
                    variant="filled"
                    type="number"
                    onChange={(e) =>
                      setFundCAGR({
                        ...fundCAGR,
                        oneYear: parseFloat(e.target.value),
                      })
                    }
                    value={fundCAGR.oneYear}
                  />
                  <Input
                    placeholder="3 Yrs"
                    onChange={(e) =>
                      setFundCAGR({
                        ...fundCAGR,
                        threeYears: parseFloat(e.target.value),
                      })
                    }
                    value={fundCAGR.threeYears}
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
                    value={fundCAGR.fiveYears}
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
                    value={fundReturns.threeMonths}
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
                    value={fundReturns.sixMonths}
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
                    value={fundReturns.oneYear}
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
                    value={fundReturns.threeYears}
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
                    value={fundReturns.fiveYears}
                  />
                </Stack>
              </Stack>
              <Stack direction="column" spacing={2}>
                {specificFund && (
                  <Box>
                    <Stack direction="row" spacing={2} sx={{ my: 4 }}>
                      <Stack direction="column" spacing={1}>
                        <Text>{dayjs().format("YYYY-MM-DD")} Value:</Text>
                        <Input
                          placeholder="% Value"
                          onChange={(e) => setTodayValue(e.target.value)}
                          variant="filled"
                          type="number"
                          value={todayValue}
                        />
                      </Stack>
                      <Button
                        variant="outline"
                        sx={{ alignSelf: "flex-end" }}
                        onClick={handleFundUpdate}
                      >
                        UPDATE Daily Change
                      </Button>
                    </Stack>
                    <Button
                      variant="outline"
                      onClick={() => setShowDailyChange(true)}
                    >
                      Show Daily Change Table
                    </Button>
                    <ScrollModal
                      showDailyChange={showDailyChange}
                      setShowDailyChange={setShowDailyChange}
                      dailyChange={specificFund.dailyChange}
                      title="Daily Change Table"
                    >
                      <DailyChangeTable
                        dailyChange={specificFund.dailyChange}
                      />
                    </ScrollModal>
                  </Box>
                )}
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
                <Text color={useColorModeValue("gray.600", "gray.200")}>
                  Uploaded: {dailyChangeFile && dailyChangeFile.name}
                </Text>
                {dailyChangeFile && (
                  <Button
                    variant="outline"
                    leftIcon={<DeleteIcon />}
                    onClick={() => setDailyChangeFile(null)}
                  >
                    DISCARD FILE
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => dailyChangeRef.current.click()}
                >
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `${url}/${specificFund._id}/${specificFund.dailyChangeFile}`
                    )
                  }
                >
                  Download Current DailyChange File
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
                <Stack direction="column" spacing={2}>
                  {specificFund && (
                    <Box>
                      <Button
                        variant="outline"
                        onClick={() => setShowFundGraph(true)}
                      >
                        Show Fund Graph Table
                      </Button>

                      <ScrollModal
                        showDailyChange={showFundGraph}
                        setShowDailyChange={setShowFundGraph}
                        title="Fund Graph Table"
                      >
                        <FundGraphTable fundGraph={specificFund.fundGraph} />
                      </ScrollModal>
                    </Box>
                  )}
                </Stack>
                <Text color={useColorModeValue("gray.600", "gray.200")}>
                  Uploaded: {fundGraphFile && fundGraphFile.name}
                </Text>
                {fundGraphFile && (
                  <Button
                    variant="outline"
                    leftIcon={<DeleteIcon />}
                    onClick={() => setFundGraphFile(null)}
                  >
                    DISCARD FILE
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => fundGraphRef.current.click()}
                >
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `${url}/${specificFund._id}/${specificFund.fundGraphFile}`
                    )
                  }
                >
                  Download Current FundGraph File
                </Button>
              </Stack>
              <Button variant="outline" onClick={handleFundUpdate}>
                UPDATE FUND
              </Button>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </MotionStack>
    </Box>
  );
};

export default PackageManager;
