import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  StackDivider,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { assignOrder, getOrdersByFilter } from "../api/apis";
import toIndianCurrency, { numFormatter } from "../helper";

import EmptyLottie from "../assets/lottie/emptyRecords.json";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

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

const Orders = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState("paid");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allotment, setAllotment] = useState(0);

  const handleGetOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getOrdersByFilter(page, size);
      setLoading(false);
      if (data.status && data.data.length > 0) {
        setOrders(data.data);
        if (filter === "all") {
          setFilteredOrders(orders);
        } else {
          setFilteredOrders(
            data.data.filter((order) => order.status === filter)
          );
        }
      }
      if (data.error)
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
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, [page, size]);
  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  }, [filter]);

  const handleAssignOrderAllotment = async (_id) => {
    try {
      const { data } = await assignOrder({ orderId: _id, allotment });
      if (data.status) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        handleGetOrders();
      }
      if (data.error)
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
    }
  };
  return (
    <Stack spacing={3}>
      <Heading fontSize="4xl" mb={5}>
        ORDERS
      </Heading>
      <Stack direction="row" spacing={2}>
        {["all", "pending", "paid", "created"].map((size, idx) => (
          <Tag
            size={"lg"}
            key={idx + idx}
            borderRadius="full"
            // variant="solid"
            colorScheme="green"
            cursor="pointer"
            onClick={() => setFilter(size)}
          >
            <TagLabel>{size.toUpperCase()}</TagLabel>
            {filter === size && (
              <TagCloseButton onClick={() => setFilter("all")} />
            )}
          </Tag>
        ))}
      </Stack>
      {filteredOrders.length === 0 && (
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
          <Heading>No Orders Found!</Heading>
        </Stack>
      )}
      {filteredOrders.map((order) => (
        <Box
          key={order._id}
          variants={listVariant}
          px={8}
          py={4}
          rounded="lg"
          shadow="lg"
          bg={useColorModeValue("white", "gray.800")}
          maxW="100%"
        >
          <Tag
            size="md"
            // variant="solid"
            colorScheme="teal"
            fontSize="sm"
            fontWeight="700"
          >
            {order?.status}
          </Tag>

          <Stack
            direction="row"
            spacing={2}
            mt={2}
            divider={<StackDivider />}
            justifyContent="space-evenly"
          >
            <Stack
              direction="column"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Heading fontSize="md">Amount Invested</Heading>
              <Heading fontSize="sm">{toIndianCurrency(order?.amount)}</Heading>
            </Stack>
            <Stack
              direction="column"
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Heading fontSize="md">Bought By:</Heading>
              <Stack direction="row" spacing={2}>
                <Tag size="sm" variantColor="green" variant="solid">
                  {order?.user?.firstName + " " + order?.user?.lastName}
                </Tag>
              </Stack>
            </Stack>
            {!order?.assigned && order.status !== "active" && (
              <Stack
                direction="column"
                spacing={3}
                alignItems="center"
                justifyContent="center"
              >
                <Heading fontSize="md">Allot Market Value: </Heading>
                <Stack direction="row" spacing={3}>
                  <Input
                    placeholder="Enter Market Value"
                    onChange={(e) => setAllotment(e.target.value)}
                  />
                  <Button
                    variantColor="green"
                    size="sm"
                    onClick={() => handleAssignOrderAllotment(order?._id)}
                  >
                    Allot
                  </Button>
                </Stack>
              </Stack>
            )}
            {order?.assigned && (
              <Stack
                direction="column"
                spacing={3}
                alignItems="center"
                justifyContent="center"
              >
                <Heading fontSize="md">Alloted Market Value: </Heading>
                <Stack direction="row" spacing={3}>
                  <Heading fontSize="sm">
                    {toIndianCurrency(order?.alloted)}
                  </Heading>
                </Stack>
              </Stack>
            )}

            <Stack
              direction="column"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Heading fontSize="md">
                FUND
                <br />
                PURCHASED
              </Heading>

              <Tag size="sm" colorScheme="green">
                {order?.fund?.name.substring(0, 50) + "..."}
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
              Created: {dayjs(order?.createdAt).format("dddd, DD MMMM YYYY")}
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
                navigate(`/buy/${fund._id}`);
              }}
            >
              Buy
            </Button>
          </Flex>
        </Box>
      ))}
      <Box sx={{}}>
        {filteredOrders.length > 0 && (
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
    </Stack>
  );
};

export default Orders;
