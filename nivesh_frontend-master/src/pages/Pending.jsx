import { Box, Heading, Text } from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Success() {
  return (
    <>
      <Header />
      <Box textAlign="center" py={20} px={12}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Registration Successful!
        </Heading>
        <Text color={"gray.500"}>
          Your Registration request is submitted successfully. You will receive
          your login credentials shortly on your email. Please check your spam
          incase you do not receive the email.
        </Text>
        <Text color={"gray.500"} sx={{ my: 4 }}>
          Registration approval process usually takes 2-3 business days. Please
          be patient and rest assured your account will soon be ready. If
          there's any issue with your documents provided, we shall contact you
          on same email used during Registration.
        </Text>
        <Text color={"gray.500"} sx={{ my: 4 }}>
          If there's any issue, Feel free to contact us at{" "}
          <strong>support@appname.com</strong>
        </Text>
      </Box>
      <Footer />
    </>
  );
}
