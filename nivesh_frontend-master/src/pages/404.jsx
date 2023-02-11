import { Box, Button, Heading, Text } from "@chakra-ui/react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { websiteURL } from "../env";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Box textAlign="center" py={10} px={6} my={8}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.500"} mb={6}>
          The page you're looking for does not seem to exist
        </Text>

        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => navigate(websiteURL)}
        >
          Go to Home
        </Button>
      </Box>
      <Footer />
    </>
  );
}
