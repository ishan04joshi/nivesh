import {
  Box,
  Heading,
  IconButton,
  Input,
  Stack,
  StackDivider,
  Tag,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { deleteSubscriber, getSubscribers } from "../api/apis";

import { CloseIcon } from "@chakra-ui/icons";
import Empty from "../components/Empty";
import Pagination from "@choc-ui/paginator";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useState } from "react";
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

function Subscribers() {
  const { user } = useStore();
  const toast = useToast();
  const [subs, setSubs] = useState([]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const filteredSubs = useMemo(() => {
    if (!search.trim()) return subs;
    return subs.filter((s) =>
      s?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, subs]);

  const handleGetSubscribers = async () => {
    try {
      const { data } = await getSubscribers(page, size);

      if (data?.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      setSubs(data?.data);
      setTotalPages(data?.count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSubscriber = async (email) => {
    try {
      const { data } = await deleteSubscriber(email);

      if (data?.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      handleGetSubscribers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetSubscribers();
  }, [page, size]);
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
        <Heading color="gray.600">Newsletter Subscribers: {totalPages}</Heading>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="150px"
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
        {filteredSubs?.length === 0 && <Empty />}
        {filteredSubs?.map((user, idx) => (
          <MotionStack
            direction="row"
            variants={listVariant}
            px={8}
            py={4}
            rounded="lg"
            shadow="lg"
            bg={useColorModeValue("white", "gray.800")}
            maxW="100%"
            key={user._id}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2}>
              <Tag
                size="md"
                variant="subtle"
                colorScheme="green"
                px={3}
                fontSize="sm"
                fontWeight="700"
                rounded="md"
              >
                {user.isSubscribed ? "Subscribed" : "Unsubscribed"}
              </Tag>

              <Stack
                direction="row"
                spacing={2}
                mt={2}
                divider={<StackDivider />}
                justifyContent="space-evenly"
              >
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Subscribed on: </Heading>
                  <Text fontSize="sm">
                    {dayjs(user?.createdAt).format("DD MMM YYYY")}
                  </Text>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Heading fontSize="md">Email: </Heading>
                  <Text fontSize="sm">{user?.email}</Text>
                </Stack>
              </Stack>
            </Stack>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => handleDeleteSubscriber(user?.email)}
            />
          </MotionStack>
        ))}
      </MotionStack>
      <Box color="gray.600">
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
}

export default Subscribers;
