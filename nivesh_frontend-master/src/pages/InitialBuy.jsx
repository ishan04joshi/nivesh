import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { buyNow, getSpecificFund, paymentStatus, baseurl } from "../api/apis";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import useStore from "../store/store";

const InitialBuy = () => {
  // const { user } = useStore();
  const user = useStore((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const [checkForStatus, setCheckForStatus] = useState(false);
  const [specificFund, setSpecificFund] = useState(null);
  const [purchaseType, setPurchaseType] = useState("one-time");
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const handleGetFundDetails = async () => {
    if (!id) return;
    try {
      const { data } = await getSpecificFund(id);
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

  const handlePayment = async () => {
    if (purchaseAmount < specificFund.minimumInvestment)
      return toast({
        title: "Error",
        description: "Minimum investment is ₹" + specificFund.minimumInvestment,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    try {
      const { data } = await buyNow({
        amount: purchaseAmount,
        id,
        purchaseType,
      });
      console.log(data);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      if (data.recurring) {
        const options = {
          key: data.key,
          currency: "INR",
          name: specificFund?.name,
          description: specificFund?.description,
          image: "/src/favicon.svg",
          subscription_id: data.subscription.id,
          callback_url: `${baseurl}/api/v1/verification`,
          prefill: {
            name: user?.firstName + " " + user?.lastName,
            email: user?.email,
            contact: user?.phone,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#121212",
          },
          notify: {
            sms: true,
            email: true,
          },

          options: {
            checkout: {
              readonly: {
                email: true,
                contact: true,
              },
              method: {
                netbanking: true,
                card: true,
                upi: true,
                wallet: true,
              },
            },
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          name: specificFund?.name,
          description: specificFund?.description,
          image: "/src/favicon.svg",
          order_id: data.order.id,
          callback_url: `${baseurl}/api/v1/verification`,
          prefill: {
            name: user?.firstName + " " + user?.lastName,
            email: user?.email,
            contact: user?.phone,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#121212",
          },
          notify: {
            sms: true,
            email: true,
          },

          options: {
            checkout: {
              readonly: {
                email: true,
                contact: true,
              },
              method: {
                netbanking: true,
                card: true,
                upi: true,
                wallet: true,
              },
            },
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
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

  useEffect(() => {
    handleGetFundDetails();
  }, [id]);

  return (
    <Stack spacing={3}>
      <Alert status="info" w="fit-content">
        <AlertIcon />
        2% Processing Fees will be added.
      </Alert>
      <Text>Buying...</Text>
      <Stack spacing={4} mt={10} border="1px" borderRadius={"md"} p={3}>
        <Stack direction="row" justifyContent="space-between">
          <Heading>{specificFund?.name}</Heading>
          <Heading>₹ {specificFund?.minimumInvestment}</Heading>
        </Stack>
        <Text>{specificFund?.description}</Text>
      </Stack>
      <Stack direction="row" spacing={25} mt={8}>
        <Text>Purchase Type:</Text>
        <RadioGroup defaultValue={purchaseType}>
          <Stack>
            onChange={() => setPurchaseType("recurring")}
            <Radio value="one-time" isChecked={purchaseType === "one-time"}>
              One Time Payment
            </Radio>
            <Radio
              value="recurring"
              isChecked={purchaseType === "recurring"}
              onChange={() => setPurchaseType("recurring")}
            >
              SIP / Recurring
            </Radio>
          </Stack>
        </RadioGroup>
      </Stack>
      <Stack direction="row" spacing={5} mt={8}>
        <Text>Purchase Amount:</Text>
        <Text>₹</Text>
        <Input
          type="number"
          placeholder="Enter Amount"
          onChange={(e) => setPurchaseAmount(e.target.value)}
          w="fit-content"
        />{" "}
      </Stack>

      <Button
        rounded={"none"}
        w={"full"}
        mt={8}
        size={"lg"}
        py={"7"}
        bg={useColorModeValue("gray.900", "gray.50")}
        color={useColorModeValue("white", "gray.900")}
        textTransform={"uppercase"}
        _hover={{
          transform: "translateY(2px)",
          boxShadow: "lg",
        }}
        onClick={handlePayment}
      >
        BUY - {purchaseAmount}
      </Button>
    </Stack>
  );
};

export default InitialBuy;
