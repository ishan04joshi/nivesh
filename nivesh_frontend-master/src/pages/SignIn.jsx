import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { dashboardURL, websiteURL } from "../env";
import { requestPin, sendLoginOtp, verifyLoginOtp } from "../api/apis";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

export default function SimpleCard() {
  const toast = useToast();
  // const { setUser } = useStore();
  const setUser = useStore((state) => state.setUser);
  const setSessionExpired = useStore((state) => state.setSessionExpired);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendLoginOtp = async () => {
    if (!id || !pin)
      return toast({
        title: "Missing Details",
        description: "Please Fill in User ID & Password.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    setLoading(true);
    try {
      const { data } = await sendLoginOtp(id, pin);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      setShowOtpBox(true);
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for OTP.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleLogin = async () => {
    if (!id || !pin || !otp)
      return toast({
        title: "Error",
        description: "Please enter your User ID, PIN, OTP.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    setLoading(true);
    try {
      const { data } = await verifyLoginOtp(id, pin, otp);
      if (data.status) {
        setSessionExpired(false);
        console.log(data.data);
        setUser(data.data);
        navigate("/");
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
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleRequestPin = async () => {
    try {
      if (!id)
        return toast({
          title: "Error",
          description: "Please enter your User ID or Phone.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

      const { data } = await requestPin(id);
      if (data.status) {
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
      toast({
        title: "Error",
        description: e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Log in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to access your Dashboard
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <Stack direction="column" spacing={1}>
                <Text>Email or Phone</Text>
                <Input
                  type="text"
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Email Address or Phone Number"
                />
              </Stack>
              <Stack direction="column" spacing={1}>
                <Text>PIN</Text>
                <Input
                  type="password"
                  placeholder="Your PIN"
                  onChange={(e) => setPin(e.target.value)}
                />
              </Stack>
              {showOtpBox && (
                <Stack direction="row" spacing={2}>
                  <Text
                    color={useColorModeValue("gray.600", "gray.400")}
                    sx={{ alignSelf: "center" }}
                  >
                    OTP
                  </Text>
                  <PinInput onChange={(e) => setOtp(e)}>
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                    <PinInputField
                      bg={"gray.600"}
                      color={"gray.100"}
                      border={4}
                    />
                  </PinInput>
                </Stack>
              )}
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-around"
                >
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={handleSendLoginOtp}
                    sx={{ width: "100%" }}
                    isLoading={loading}
                  >
                    SEND OTP
                  </Button>
                  {showOtpBox && (
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      sx={{ width: "100%" }}
                      onClick={handleLogin}
                      isLoading={loading}
                    >
                      SIGN IN
                    </Button>
                  )}
                </Stack>

                <Button
                  // bg={"blue.400"}
                  // color={"white"}
                  _hover={{
                    bg: "green.800",
                  }}
                  onClick={() => navigate("/signup")}
                  variant="outline"
                >
                  Not Registered? Sign up here
                </Button>
                <Button
                  // bg={"blue.400"}
                  // color={"white"}
                  _hover={{
                    bg: "red.600",
                  }}
                  onClick={handleRequestPin}
                  variant="outline"
                >
                  Forgot PIN? Request here
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <Footer />
    </>
  );
}
