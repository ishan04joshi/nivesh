import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { unsubscribeNewsletter } from "../api/index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NotFound() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const handleUnsubscribe = async () => {
    try {
      if (!email) return;
      const { data } = await unsubscribeNewsletter(email);
      if (data?.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Stack
        spacing={3}
        alignItems="center"
        textAlign="center"
        py={10}
        px={6}
        my={8}
      >
        <Heading
          display="inline-block"
          //   as="h2"
          size="3xl"
          bgGradient="linear(to-r, blue.400, blue.600)"
          backgroundClip="text"
          pb={2}
        >
          Sorry to see you go~!
        </Heading>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          w="200px"
          focusBorderColor="blue.400"
        />
        <Text color={"gray.500"} mb={6}>
          Enter Your Email to Unsubscribe from our Newsletter.
        </Text>

        <Button
          colorScheme="blue"
          bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
          color="white"
          variant="solid"
          onClick={handleUnsubscribe}
        >
          Unsubscribe
        </Button>
      </Stack>
    </>
  );
}
