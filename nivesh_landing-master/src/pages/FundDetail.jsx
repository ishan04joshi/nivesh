import {
  Box,
  Button,
  Container,
  Flex,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  ListItem,
  Progress,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import {
  FaDollarSign,
  FaInstagram,
  FaShareAltSquare,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdCallMerge, MdLocalShipping, MdPerson } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";
import { getSpecificFund, url } from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { BiPencil } from "react-icons/bi";
import Chart from "react-apexcharts";
import Loader from "../components/Loader";
import LoadingData from "../assets/lottie/loading.json";
import LottiePlayer from "lottie-react";
import { PORTAL_URL } from "../constants";
import { WEBSITE_URL } from "../constants";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { toIndianCurrency } from "../utils";

dayjs.extend(isBetween);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const FundDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [specificFund, setSpecificFund] = useState(null);
  const [hadInvested, setHadInvested] = useState("10000");
  const [years, setYears] = useState("1");
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState("ALL");

  const dailyChangeGraph = useMemo(() => {
    return specificFund?.dailyChange?.map((item) => [
      new Date(item.x).getTime(),
      item.y,
    ]);
  }, [specificFund?.dailyChange]);

  const investedOutcome = useMemo(() => {
    if (years === "1") {
      return hadInvested * specificFund?.cagr?.oneYear;
    }
    if (years === "3") {
      return hadInvested * specificFund?.cagr?.threeYears;
    }
    if (years === "5") {
      return hadInvested * specificFund?.cagr?.fiveYears;
    }
  }, [specificFund?.cagr, hadInvested, years]);

  const lineChartOptions = useMemo(() => {
    return {
      chart: {
        id: "area-datetime",
        type: "area",
        zoom: {
          autoScaleYaxis: true,
        },
      },

      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      
      xaxis: {
        type: "datetime",
        min: new Date(
          specificFund?.fundGraph?.at(0)?.x || Date.now()
        ).getTime(),
        tickAmount: 6,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      tooltip: {
        x: {
          formatter: (val) => dayjs(val).format("DD MMM YYYY"),
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        y: {
          formatter: (val) => toIndianCurrency(val),
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
      },
    };
  }, [specificFund]);
  const minimalLineChartOptions = useMemo(() => {
    return {
      chart: {
        id: "area-datetime",
        type: "area",
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          show: true,
        },
      },

      dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
          return val + "%";
        },
      },
      markers: {
        size: 0,
        style: "hollow",
      },
    
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      tooltip: {
        x: {
          formatter: (val) => dayjs(val).format("DD MMM YYYY"),
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        y: {
          formatter: (val) => val + "%",
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
    };
  }, [specificFund]);

  const linechartData = useMemo(() => {
    if (chartFilter === "ALL") {
      return specificFund?.fundGraph?.map((item) => [
        new Date(item.x).getTime(),
        item.y,
      ]);
    }
    if (chartFilter === "3M") {
      let currDate = dayjs().format("YYYY-MM-DD");
      let oneMonthBefore = dayjs().subtract(3, "month").format("YYYY-MM-DD");
      return specificFund?.fundGraph
        .filter((item) => {
          return dayjs(item.x).isBetween(oneMonthBefore, currDate);
        })
        .map((item) => [new Date(item.x).getTime(), item.y]);
    }
    if (chartFilter === "6M") {
      let currDate = dayjs();
      let sixMonthsBefore = dayjs().subtract(6, "month");
      return specificFund?.fundGraph
        .filter((item) => {
          return dayjs(item.x).isBetween(sixMonthsBefore, currDate);
        })
        .map((item) => [new Date(item.x).getTime(), item.y]);
    }
    if (chartFilter === "1Y") {
      let currDate = dayjs();
      let oneYearBefore = dayjs().subtract(1, "year");
      return specificFund?.fundGraph
        .filter((item) => {
          return dayjs(item.x).isBetween(oneYearBefore, currDate);
        })
        .map((item) => [new Date(item.x).getTime(), item.y]);
    }
    if (chartFilter === "3Y") {
      let currDate = dayjs();
      let oneYearBefore = dayjs().subtract(3, "year");
      return specificFund?.fundGraph
        .filter((item) => {
          return dayjs(item.x).isBetween(oneYearBefore, currDate);
        })
        .map((item) => [new Date(item.x).getTime(), item.y]);
    }
    if (chartFilter === "5Y") {
      let currDate = dayjs();
      let oneYearBefore = dayjs().subtract(3, "year");
      return specificFund?.fundGraph
        .filter((item) => {
          return dayjs(item.x).isBetween(oneYearBefore, currDate);
        })
        .map((item) => [new Date(item.x).getTime(), item.y]);
    }
    // return specificFund?.lineChartData;
  }, [specificFund?.fundGraph, chartFilter]);

  const riskFactor = useMemo(() => {
    if (specificFund?.riskCategory === "LOW") {
      return {
        value: 10,
        color: "green",
      };
    }
    if (specificFund?.riskCategory === "MEDIUM") {
      return {
        value: 50,
        color: "orange",
      };
    }
    if (specificFund?.riskCategory === "HIGH") {
      return {
        value: 100,
        color: "red",
      };
    }
    return {
      value: 100,
      color: "white",
    };
  }, [specificFund]);

  const handleGetFundDetails = async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      const { data } = await getSpecificFund(params.id);
      setLoading(false);
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
      setLoading(false);
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

  const piechartData = useMemo(() => {
    return specificFund?.shares?.map((item) => {
      return {
        name: item?.name,
        value: item?.allocation,
      };
    });
  }, [specificFund?.shares]);
  useEffect(() => {
    handleGetFundDetails();
  }, []);

  if (!specificFund) return null;
  if (loading)
    return (
      <Box>
        <Loader />
      </Box>
    );

  return (
    <Container maxW={"7xl"} overflow="auto" py={6}>
      <VStack spacing={4} py={5}>
        {/* Fund Header */}
        <SimpleGrid columns={[1, 1, 2]} spacing={10} w="100%">
          <GridItem colSpan={1}>
            <HStack px={6} py={4} boxShadow={"lg"} bg="white" rounded="lg">
              <Stack direction="row" spacing={3}>
                <Image
                  src={
                    url +
                    "/" +
                    specificFund?._id +
                    "/" +
                    specificFund?.fundImageFile
                  }
                  // h="80px"
                  w="80px"
                  fallback={<FaDollarSign />}
                  alt={specificFund?.name}
                  objectFit="contain"
                />
                <Stack spacing={1}>
                  <Heading fontSize="md" color="gray.600">
                    {specificFund?.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.400">
                    {specificFund?.shortDescription.substring(0, 50)}...
                  </Text>
                </Stack>
              </Stack>
            </HStack>
          </GridItem>
          <GridItem colSpan={1}>
            <Stack
              boxShadow={"lg"}
              rounded="lg"
              direction="row"
              spacing={4}
              bg="white"
              divider={<StackDivider />}
              px={6}
              py={4}
              justifyContent="space-evenly"
            >
              <VStack justifyContent="space-between">
                <Heading fontSize={"md"} color="gray.600">
                  3Y CAGR
                </Heading>
                <Text>{specificFund?.cagr?.threeYears}</Text>
              </VStack>
              <VStack h="100%" justifyContent={"space-between"}>
                <Heading fontSize={"md"} color="gray.600">
                  Risk Category
                </Heading>
                <Tooltip
                  placement="bottom"
                  hasArrow
                  label={specificFund?.riskCategory}
                >
                  {/* <Progress
                    w="100%"
                    rounded="lg"
                    hasStripe
                    value={riskFactor.value}
                    colorScheme={riskFactor.color}
                  /> */}
                  <Heading fontSize="sm" color={riskFactor.color}>
                    {specificFund?.riskCategory}
                  </Heading>
                </Tooltip>
              </VStack>
              <VStack>
                <Heading fontSize={"md"}>
                  ₹{specificFund?.minimumInvestment}
                </Heading>
                <HStack>
                  <Button
                    size={"xs"}
                    bgColor="blue.400"
                    color={"white"}
                    onClick={() => {
                      window.location.href =
                        PORTAL_URL + "/buy/" + specificFund?._id;
                    }}
                  >
                    Invest
                  </Button>
                  <Button
                    size={"xs"}
                    bgColor="blue.400"
                    color={"white"}
                    leftIcon={<FaShareAltSquare />}
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: specificFund?.name,
                            text: specificFund?.shortDescription,
                            url: window.location.href,
                          })
                          .then(() => console.log("Successful share"))
                          .catch((error) =>
                            console.log("Error sharing", error)
                          );
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Copied",
                          description: "Copied URL to clipboard.",
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                          position: "bottom-right",
                        });
                      }
                    }}
                  >
                    SHARE
                  </Button>
                </HStack>
              </VStack>
            </Stack>
          </GridItem>
        </SimpleGrid>
        {/* CALCULATOR */}
        <Box w="100%" py={6} boxShadow={"lg"} bg="white" rounded="lg" px={2}>
          <Stack
            justifyContent="space-evenly"
            direction="row"
            w="100%"
            flexWrap={"wrap"}
            gap={1}
          >
            <Stack direction={["column", "column", "row"]}>
              <Heading fontSize="sm" color="gray.600">
                If I had invested
              </Heading>
              <InputGroup size="xs">
                <InputLeftAddon children="₹" />
                <Input
                  pl={2}
                  defaultValue={1000000}
                  variant="flushed"
                  type="number"
                  bg="white"
                  w="100px"
                  onClick={(e) => setHadInvested(+e.target.value)}
                />
              </InputGroup>
            </Stack>
            <Stack direction={["column", "column", "row"]}>
              <Heading fontSize="sm" color="gray.600">
                No. of years
              </Heading>
              <RadioGroup defaultValue="1" onChange={(e) => setYears(e)}>
                <Stack direction={["row"]}>
                  <Radio value="1">1Y</Radio>
                  <Radio value="3">3Y</Radio>
                  <Radio value="5">5Y</Radio>
                </Stack>
              </RadioGroup>
            </Stack>
            <HStack>
              <Heading fontSize="sm" alignSelf={"center"} color="gray.600">
                Today's value
              </Heading>
              <Text fontWeight={"bold"} fontSize="md" color="green.400">
                {toIndianCurrency(investedOutcome)}
              </Text>
            </HStack>
          </Stack>
        </Box>
        <SimpleGrid columns={[1, 1, 3]} spacing={10} w="100%">
          <GridItem
            boxShadow={"lg"}
            bg="white"
            rounded="lg"
            px={6}
            py={4}
            overflow="hidden"
            colSpan={[1, 1, 2]}
          >
            <Stack>
              <Stack>
                <Heading fontSize={"2xl"} color="gray.600">
                  Past Performance of Fund
                </Heading>
                <Stack direction="row">
                  {["ALL", "3M", "6M", "1Y", "3Y", "5Y"].map((item) => (
                    <Tag
                      onClick={() => setChartFilter(item)}
                      variant="subtle"
                      colorScheme={"blue"}
                      cursor="pointer"
                      _hover={{
                        scale: 1.05,
                      }}
                      key={item}
                    >
                      {item}
                    </Tag>
                  ))}
                </Stack>
              </Stack>
              <Chart
                options={lineChartOptions}
                series={[
                  {
                    name: "Fund Value",
                    data: linechartData,
                  },
                ]}
                type="area"
                // width="600"
                h="300"
              />
            </Stack>
          </GridItem>
          <GridItem
            bg="white"
            rounded="lg"
            boxShadow={"lg"}
            px={6}
            py={4}
            overflow="hidden"
            h="fit-content"
          >
            <Heading fontSize="2xl" color="gray.600">
              Description of Fund
            </Heading>
            <Stack h="100%" mt={4} spacing={5}>
              <Stack
                p="2"
                rounded="lg"
                align="center"
                bgGradient="linear(to-l, blue.400, blue.700)"
                spacing={2}
                color="white"
              >
                <Heading textAlign={"center"} fontSize={"md"}>
                  {toIndianCurrency(specificFund?.minimumInvestment)}
                </Heading>
                <Text fontSize={"sm"}>Min Invest Amount</Text>
              </Stack>
              <Stack
                p="2"
                rounded="lg"
                align="center"
                bgGradient="linear(to-l, blue.400, blue.700)"
                spacing={2}
                color="white"
              >
                <Heading textAlign={"center"} fontSize={"md"}>
                  ₹ 5,000/-
                </Heading>
                <Text fontSize={"sm"}>1 YR CAGR</Text>
              </Stack>
              <Stack
                p="2"
                rounded="lg"
                align="center"
                bgGradient="linear(to-l, blue.400, blue.700)"
                spacing={2}
                color="white"
              >
                <Heading fontSize={"md"}>
                  {toIndianCurrency(
                    specificFund?.fundGraph[specificFund?.fundGraph?.length - 1]
                      ?.y
                  )}
                </Heading>
                <Text>Daily Change</Text>
              </Stack>
              <Chart
                options={minimalLineChartOptions}
                series={[
                  {
                    name: "Daily Change",
                    data: dailyChangeGraph,
                  },
                ]}
                type="area"
                // width="600"
                // h="300"
              />
            </Stack>
          </GridItem>
          <GridItem
            bg="white"
            rounded="lg"
            boxShadow={"lg"}
            px={6}
            py={4}
            overflow="hidden"
          >
            <Heading fontSize="2xl" color="gray.600">
              Fund Objective
            </Heading>
            <Text mt={4} color="gray.400">
              {specificFund?.description}
            </Text>
          </GridItem>
          <GridItem
            colSpan={[1, 1, 2]}
            bg="white"
            rounded="lg"
            boxShadow={"lg"}
            px={6}
            py={4}
            overflow="hidden"
          >
            <Heading fontSize={"2xl"} color="gray.600">
              Weightings of Fund
            </Heading>
            <Stack direction="row" spacing={2} justifyContent="space-around">
              <PieChart width={150} height={150}>
                <Pie
                  data={piechartData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  // outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {piechartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <Stack justify="center" spacing={2} divider={<StackDivider />}>
                {specificFund?.shares?.map((share, index) => (
                  <Stack direction={"row"} spacing={10}>
                    <Text>{share?.name}</Text>
                    <Heading fontSize={"md"}>{share?.allocation}</Heading>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </GridItem>
        </SimpleGrid>
        <Stack w="100%" mb={6}>
          <Heading fontSize={"2xl"} color="gray.600">
            Fund Return Comparison
          </Heading>
          <TableContainer rounded={"lg"} border="1px" borderColor="gray.300">
            <Table variant="striped" colorScheme={"blue"}>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>3M</Th>
                  <Th>6M</Th>
                  <Th>1Y</Th>
                  <Th>3Y</Th>
                  <Th>5Y</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Text fontWeight={"bold"} color="gray.600">
                      {specificFund?.name}
                    </Text>
                  </Td>
                  <Td>
                    <Heading fontSize="sm">
                      {specificFund?.returns?.threeMonths} %
                    </Heading>
                  </Td>
                  <Td>
                    <Heading fontSize="sm">
                      {specificFund?.returns?.sixMonths}%
                    </Heading>
                  </Td>
                  <Td>
                    <Heading fontSize="sm">
                      {specificFund?.returns?.oneYear}%
                    </Heading>
                  </Td>
                  <Td>
                    <Heading fontSize="sm">
                      {specificFund?.returns?.threeYears}%
                    </Heading>
                  </Td>
                  <Td>
                    <Heading fontSize="sm">
                      {specificFund?.returns?.fiveYears}%
                    </Heading>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight={"bold"} color="gray.600">
                      Fixed Deposit
                    </Text>
                  </Td>
                  <Td>3.90%</Td>
                  <Td>4.85%</Td>
                  <Td>6.75%</Td>
                  <Td>9.56%</Td>
                  <Td>11.52%</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight={"bold"} color="gray.600">
                      S&P BSE Midcap
                    </Text>
                  </Td>
                  <Td>4.10%</Td>
                  <Td>8.47%</Td>
                  <Td>12.80%</Td>
                  <Td>16.20%</Td>
                  <Td>19.00%</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </VStack>
    </Container>
  );
};

export default FundDetail;
