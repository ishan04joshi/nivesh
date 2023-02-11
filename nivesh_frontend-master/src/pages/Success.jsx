import { Box, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import { getSpecificOrder } from "../api/apis";
import { useParams } from "react-router-dom";

const Success = () => {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);

  const handleGetOrderDetails = async () => {
    try {
      const { data } = await getSpecificOrder(id);
      if (data.status) {
        setOrder(data.data);
      }
      if (data.error) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetOrderDetails();
  }, []);
  return (
    <Stack
      spacing={3}
      textAlign="center"
      py={10}
      px={6}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Order Successful.
      </Heading>
      <Box border="1px" borderRadius="md" w="fit-content" px={4} py={4}>
        <Text>Order ID: {order?._id}</Text>
        <Text>Order Status: {order?.status?.toUpperCase()}</Text>
      </Box>
      <Text color={"gray.500"}>
        Congratulations on your purchase, We have received the payment for and
        now awaited allotment by managers. Please Wait for the confirmation.
      </Text>
    </Stack>
  );
};

export default Success;
