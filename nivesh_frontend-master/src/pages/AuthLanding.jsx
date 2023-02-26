import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  PinInput,
  PinInputField,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { sendRegisterOtp, verifyRegisterOtp } from "../api/apis";

import BSELogo from "../assets/bse-logo.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NSELogo from "../assets/nse-logo.png";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

export default function JoinOurTeam() {
  const navigate = useNavigate();
  const toast = useToast();
  const { phone, setPhone, email, setEmail, setUser } = useStore();
  const [showOtpBoxes, setShowOtpBoxes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const handleGetOtp = async () => {
    if (!phone || !email)
      return toast({
        title: "Please enter your phone number and email address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    setLoading(true);
    try {
      const { data } = await sendRegisterOtp(phone, email);

      if (data.status) {
        toast({
          title: "OTP sent successfully",
          description: "Please check your Phone & Email.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
        });
        setShowOtpBoxes(true);
        setLoading(false);
      }
      if (!data.status) {
        setLoading(false);
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error",
        description:
          "Something Went Wrong! Please Contact Administrator. " +
          error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  const handleVerifyOtp = async () => {
    if (!phoneOtp || !emailOtp)
      return toast({
        title: "Please enter your OTP",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    setLoading(true);
    try {
      const { data } = await verifyRegisterOtp(
        phone,
        phoneOtp,
        email,
        emailOtp,
      );
      if (data.status) {
        toast({
          title: "OTP verified successfully",
          description: "Welcome to Niveshkro.com!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
        setLoading(false);
        setUser(data.data);
        navigate("/");
      }
      if (!data.status) {
        setLoading(false);
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error",
        description:
         error?.message || error?.data?.message ||  "Something Went Wrong! Please Contact Administrator. ",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  return (
    <>
      <Header />
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              zIndex={1}
            >
              Join the World{" "}
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                &
              </Text>{" "}
              Emerge Your Savings Into Exponential Growth
            </Heading>
            <Stack direction={"row"} spacing={4} align={"center"}>
              <AvatarGroup>
                <Avatar
                  key="nse-logo"
                  name="NSE"
                  src={NSELogo}
                  size={useBreakpointValue({ base: "md", md: "lg" })}
                  position={"relative"}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: "full",
                    height: "full",
                    rounded: "full",
                    transform: "scale(1.125)",
                    bgGradient: "linear(to-bl, purple.400,green.400)",
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
                <Avatar
                  key="bse-logo"
                  name="BSE"
                  src={BSELogo}
                  size={useBreakpointValue({ base: "md", md: "lg" })}
                  position={"relative"}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: "full",
                    height: "full",
                    rounded: "full",
                    transform: "scale(1.125)",
                    bgGradient: "linear(to-bl, purple.400,green.400)",
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
              </AvatarGroup>
              <Text
                fontFamily={"heading"}
                fontSize={{ base: "4xl", md: "6xl" }}
              >
                +
              </Text>
              <Flex
                align={"center"}
                justify={"center"}
                fontFamily={"heading"}
                fontSize={{ base: "sm", md: "lg" }}
                bg={"gray.800"}
                color={"white"}
                rounded={"full"}
                width={useBreakpointValue({ base: "44px", md: "60px" })}
                height={useBreakpointValue({ base: "44px", md: "60px" })}
                position={"relative"}
                _before={{
                  content: '""',
                  width: "full",
                  height: "full",
                  rounded: "full",
                  transform: "scale(1.125)",
                  bgGradient: "linear(to-bl, orange.400,yellow.400)",
                  position: "absolute",
                  zIndex: -1,
                  top: 0,
                  left: 0,
                }}
              >
                YOU
              </Flex>
            </Stack>
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Register
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                Please Verify Your Phone Number and Email to Proceed to
                Registration and Continue Purchasing Your Favorite Package.
              </Text>
            </Stack>
            <Box as={"form"} mt={10}>
              <Stack spacing={4}>
                <Input
                  placeholder="Phone Number"
                  bg={"gray.100"}
                  border={0}
                  autoComplete="phone"
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={phone || ""}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
                <Input
                  placeholder="Email Address"
                  autoComplete="email"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />

                {showOtpBoxes && (
                  <HStack>
                    <Text color={useColorModeValue("gray.600", "gray.400")}>
                      PHONE OTP
                    </Text>
                    <PinInput onChange={(e) => setPhoneOtp(e)}>
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                    </PinInput>
                  </HStack>
                )}
                {showOtpBoxes && (
                  <HStack>
                    <Text color={useColorModeValue("gray.600", "gray.400")}>
                      EMAIL OTP
                    </Text>
                    <PinInput onChange={(e) => setEmailOtp(e)}>
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                      <PinInputField
                        bg={"gray.300"}
                        color={"gray.600"}
                        border={4}
                      />
                    </PinInput>
                  </HStack>
                )}
              </Stack>
              {showOtpBoxes ? (
                <Stack direction="column" spacing={2}>
                  <Button
                    fontFamily={"heading"}
                    mt={8}
                    w={"full"}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, red.400,pink.400)",
                      boxShadow: "xl",
                    }}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                  <Button
                    fontFamily={"heading"}
                    mt={8}
                    w={"full"}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, red.400,pink.400)",
                      boxShadow: "xl",
                    }}
                    onClick={handleGetOtp}
                  >
                    Resend OTP
                  </Button>
                </Stack>
              ) : (
                <Button
                  fontFamily={"heading"}
                  mt={8}
                  w={"full"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={"white"}
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  onClick={handleGetOtp}
                >
                  Send OTP
                </Button>
              )}
            </Box>
            form
          </Stack>
        </Container>
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          zIndex={-1}
          style={{ filter: "blur(70px)" }}
        />
      </Box>
      <Footer />
    </>
  );
}

export const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};
