import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  BsGithub,
  BsLinkedin,
  BsPerson,
  BsPhone,
  BsTwitter,
} from "react-icons/bs";
import { MdEmail, MdOutlineEmail } from "react-icons/md";

import React from "react";
import { motion } from "framer-motion";
import { pageTransitions } from "../utils/pageTransitions";
import { submitSupportRequest } from "../api";

const MotionFlex = motion(Flex);
const MotionSimpleGrid = motion(SimpleGrid);
const MotionGridItem = motion(GridItem);
export default function ContactFormWithSocialButtons() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const toast = useToast();

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setPhone("");
    setIsSubmitting(false);
    setIsSubmitted(false);
    setIsError(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!name || !email || !message || !phone) {
        setIsError(true);
        return;
      }
      if (String(phone).length < 10) {
        setIsError(true);
        return;
      }
      setIsError(false);
      setIsSubmitting(true);
      const res = await submitSupportRequest({ name, email, message, phone });
      if (res?.data?.error)
        return toast({
          title: "Error",
          description: res.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      setIsSubmitted(true);
      reset();
      toast({
        title: "Success",
        description: res.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <MotionSimpleGrid
      columns={[1, 1, 1, 2]}
      gap={2}
      variants={pageTransitions}
      initial="initial"
      animate="animate"
      exit="exit"
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <GridItem>
        <MotionFlex
          align="center"
          justify="center"
          css={{
            backgroundAttachment: "fixed",
          }}
          id="contact"
          pb={10}
        >
          <Box
            borderRadius="lg"
            m={{ base: 5, md: 16, lg: 10 }}
            p={{ base: 5, lg: 16 }}
          >
            <Box>
              <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
                <Heading
                  fontSize={{
                    base: "4xl",
                    md: "5xl",
                  }}
                >
                  Get in Touch
                </Heading>

                <Stack
                  spacing={{ base: 4, md: 8, lg: 20 }}
                  direction={{ base: "column", md: "row" }}
                >
                  <Box
                    bg={useColorModeValue("white", "gray.700")}
                    borderRadius="lg"
                    p={8}
                    color={useColorModeValue("gray.700", "whiteAlpha.900")}
                    shadow="base"
                  >
                    <VStack spacing={5}>
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>

                        <InputGroup>
                          <InputLeftElement children={<BsPerson />} />
                          <Input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Mobile Number</FormLabel>

                        <InputGroup>
                          <InputLeftElement children={<BsPhone />} />
                          <Input
                            type="tel"
                            autoComplete="tel-national"
                            name="phone"
                            placeholder="Your Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>

                        <InputGroup>
                          <InputLeftElement children={<MdOutlineEmail />} />
                          <Input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Message</FormLabel>

                        <Textarea
                          name="message"
                          placeholder="Your Message"
                          rows={6}
                          resize="none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        bg="blue.400"
                        color="white"
                        _hover={{
                          bg: "blue.500",
                        }}
                        isFullWidth
                        onClick={handleSubmit}
                      >
                        Send Message
                      </Button>
                    </VStack>
                    {isError && (
                      <Text color="red.500" fontSize="sm">
                        Please fill all the fields
                      </Text>
                    )}
                  </Box>
                </Stack>
              </VStack>
            </Box>
          </Box>
        </MotionFlex>
      </GridItem>
      <GridItem>
        
        <MotionFlex
          align="center"
          justify="center"
          css={{
            backgroundAttachment: "fixed",
          }}
          id="contact"
          pb={10}
        >
          <Box
            borderRadius="lg"
            m={{ base: 5, md: 16, lg: 10 }}
            p={{ base: 5, lg: 16 }}
          >
            <Box>
              <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
                <Stack
                  spacing={{ base: 4, md: 8, lg: 20 }}
                  direction={"column"}
                >
                  <Stack spacing={1}>
                    <Heading color="gray.600">Email us:</Heading>
                    <Text
                      as="button"
                      textAlign={"left"}
                      color="blue.400"
                      onClick={(e) => {
                        window.location.href = `mailto:help@niveshkro.com`;
                        e.preventDefault();
                      }}
                    >
                      help@niveshkro.com
                    </Text>
                  </Stack>
                  <Stack spacing={1}>
                    <Heading color="gray.600">Whatsapp us:</Heading>
                    <Text
                      as="button"
                      textAlign={"left"}
                      color="blue.400"
                      onClick={(e) => {
                        window.open("www.whatsapp.com");
                        e.preventDefault();
                      }}
                    >
                      Click here
                    </Text>
                  </Stack>

                  <Stack spacing={1}>
                    <Heading color="gray.600">Mailing Address:</Heading>
                    <Text textAlign={"left"} color="blue.400">
                      R2I Business Process Services Private Limited FF-10, 1 st
                      Floor, SS Omnia Mall, Sec-86 Gurgaon, Haryana-122004.
                    </Text>
                  </Stack>
                </Stack>
              </VStack>
            </Box>
          </Box>
        </MotionFlex>
      </GridItem>
    </MotionSimpleGrid>
  );
}
